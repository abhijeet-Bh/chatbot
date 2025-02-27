import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChatbotComponent} from "../chatbot/chatbot.component";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, ChatbotComponent],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {}
