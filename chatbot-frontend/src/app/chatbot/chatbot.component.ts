import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { marked } from 'marked';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
  imports: [
    NgClass,
    NgForOf,
    FormsModule,
    NgIf
  ]
})
export class ChatbotComponent {
  isOpen = false;
  userInput: string = '';
  messages: { text: string; sender: 'user' | 'bot' }[] = [];
  loading = false;

  constructor(private http: HttpClient) {}

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  async sendMessage() {
    if (!this.userInput.trim()) return;

    const userMessage = this.userInput;
    this.messages.push({ text: userMessage, sender: 'user' });
    this.userInput = '';
    this.loading = true;

    try {
      const res = await this.http
        .get<{ response: string }>(`http://127.0.0.1:5000/search?query=${encodeURIComponent(userMessage)}`)
        .toPromise();

      this.loading = false;

      if (res && res.response) {
        const parsedResponse = await marked(res.response); // Await for Markdown conversion
        this.messages.push({ text: parsedResponse, sender: 'bot' });
      } else {
        this.messages.push({ text: "Sorry, I don't have an answer to that question.", sender: 'bot' });
      }
    } catch (error) {
      this.loading = false;
      console.error('Error fetching response:', error);
      this.messages.push({ text: "Error connecting to the support system.", sender: 'bot' });
    }
  }
}
