import { Component } from '@angular/core';

@Component({
  selector: 'app-mobile-test',
  template: `
    <div class="mobile-test-container">
      <h2>Mobile Optimization Test</h2>
      
      <!-- Touch Target Test -->
      <div class="test-section">
        <h3>Touch Target Test</h3>
        <p>All buttons below should be at least 44px × 44px:</p>
        <div class="button-grid">
          <button class="test-btn primary">Primary</button>
          <button class="test-btn secondary">Secondary</button>
          <button class="test-btn danger">Danger</button>
          <button class="test-btn ghost">Ghost</button>
        </div>
      </div>
      
      <!-- Typography Test -->
      <div class="test-section">
        <h3>Typography Test</h3>
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <h5>Heading 5</h5>
        <h6>Heading 6</h6>
        <p>This is a paragraph with normal text. It should be readable on mobile devices.</p>
      </div>
      
      <!-- Form Test -->
      <div class="test-section">
        <h3>Form Test</h3>
        <form class="test-form">
          <div class="form-group">
            <label>Name</label>
            <input type="text" placeholder="Enter your name" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" />
          </div>
          <div class="form-group">
            <label>Role</label>
            <select>
              <option>Student</option>
              <option>Teacher</option>
              <option>Admin</option>
            </select>
          </div>
          <button type="submit" class="test-btn primary">Submit</button>
        </form>
      </div>
      
      <!-- Grid Test -->
      <div class="test-section">
        <h3>Grid Test</h3>
        <div class="test-grid">
          <div class="grid-item">Item 1</div>
          <div class="grid-item">Item 2</div>
          <div class="grid-item">Item 3</div>
          <div class="grid-item">Item 4</div>
        </div>
      </div>
      
      <!-- Card Test -->
      <div class="test-section">
        <h3>Card Test</h3>
        <div class="test-cards">
          <div class="test-card">
            <h4>Card 1</h4>
            <p>This is a test card with some content.</p>
            <button class="test-btn primary">Action</button>
          </div>
          <div class="test-card">
            <h4>Card 2</h4>
            <p>This is another test card with content.</p>
            <button class="test-btn secondary">Action</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mobile-test-container {
      padding: 16px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .test-section {
      margin-bottom: 32px;
      padding: 16px;
      border: 1px solid #eee;
      border-radius: 8px;
    }
    
    .test-section h3 {
      margin-top: 0;
      color: #333;
    }
    
    .button-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;
      margin-top: 16px;
    }
    
    .test-btn {
      @include touch-button;
      border: none;
      cursor: pointer;
      
      &.primary {
        background: #0056b3;
        color: white;
      }
      
      &.secondary {
        background: #6c757d;
        color: white;
      }
      
      &.danger {
        background: #dc3545;
        color: white;
      }
      
      &.ghost {
        background: transparent;
        color: #0056b3;
        border: 1px solid #0056b3;
      }
    }
    
    .test-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 16px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .form-group label {
      font-weight: 500;
      color: #333;
    }
    
    .form-group input,
    .form-group select {
      @include mobile-input;
    }
    
    .test-grid {
      @include mobile-grid(2, 3, 4);
      margin-top: 16px;
    }
    
    .grid-item {
      @include mobile-card;
      text-align: center;
      padding: 20px;
      background: #f8f9fa;
    }
    
    .test-cards {
      @include mobile-grid(1, 2, 3);
      margin-top: 16px;
    }
    
    .test-card {
      @include mobile-card;
      
      h4 {
        margin-top: 0;
        color: #333;
      }
      
      p {
        color: #666;
        margin-bottom: 16px;
      }
    }
    
    @media (max-width: 768px) {
      .mobile-test-container {
        padding: 12px;
      }
      
      .test-section {
        margin-bottom: 24px;
        padding: 12px;
      }
    }
  `]
})
export class MobileTestComponent {
  constructor() {}
}
