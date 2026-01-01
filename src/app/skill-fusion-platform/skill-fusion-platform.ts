
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
  avatar: string;
  skillsToTeach: string[];
  skillsToLearn: string[];
  level: string;
  rating: number;
  online: boolean;
}

interface MatchedRoom {
  id: number;
  skill: string;
  user1: User;
  user2: User;
  status: 'pending' | 'active' | 'completed';
  roomType: '1-on-1' | 'group';
  duration: number;
  createdAt: Date;
  scheduledTime?: Date;
  roomCode?: string;
}

@Component({
  selector: 'app-skill-fusion-platform',
  standalone: true,
  imports: [CommonModule, FormsModule,NgIf,NgFor],
  templateUrl: './skill-fusion-platform.html',
  styleUrls: ['./skill-fusion-platform.css'], // fixed typo


})
export class SkillFusionPlatform implements OnInit {
  // Onboarding state
  onboardingSteps: {
    question: string;
    type: string;
    selected: number[];
    options: { id: number; name: string; icon: string; color: string; category?: string }[];
  }[] = [
    {
      question: 'What skills do you want to learn?',
      type: 'skills',
      selected: [],
      options: [
        { id: 1, name: 'Web Development', icon: 'code', color: '#3b82f6', category: 'tech' },
        { id: 2, name: 'Music Production', icon: 'music', color: '#8b5cf6', category: 'creative' },
        { id: 3, name: 'Graphic Design', icon: 'palette', color: '#ef4444', category: 'design' },
        { id: 4, name: 'Spanish', icon: 'globe', color: '#10b981', category: 'language' },
        { id: 5, name: 'Cooking', icon: 'utensils', color: '#f59e0b', category: 'life' },
        { id: 6, name: 'Photography', icon: 'camera', color: '#ec4899', category: 'creative' },
        { id: 7, name: 'Data Science', icon: 'chart-bar', color: '#6366f1', category: 'tech' },
        { id: 8, name: 'Fitness', icon: 'dumbbell', color: '#84cc16', category: 'life' }
      ]
    },
    {
      question: 'What skills can you teach or practice with others?',
      type: 'teach',
      selected: [],
      options: [
        { id: 1, name: 'JavaScript', icon: 'js', color: '#f7df1e', category: 'tech' },
        { id: 2, name: 'UI/UX Design', icon: 'pencil-ruler', color: '#8b5cf6', category: 'design' },
        { id: 3, name: 'Guitar', icon: 'guitar', color: '#ef4444', category: 'creative' },
        { id: 4, name: 'Spanish', icon: 'language', color: '#10b981', category: 'language' },
        { id: 5, name: 'Cooking', icon: 'utensils', color: '#f59e0b', category: 'life' },
        { id: 6, name: 'Photo Editing', icon: 'sliders-h', color: '#ec4899', category: 'creative' }
      ]
    },
    {
      question: 'How do you prefer to learn?',
      type: 'preference',
      selected: [],
      options: [
        { id: 1, name: 'Practice Together', icon: 'users', color: '#3b82f6' },
        { id: 2, name: 'Teach Others', icon: 'chalkboard-teacher', color: '#8b5cf6' },
        { id: 3, name: '1-on-1 Sessions', icon: 'user-friends', color: '#10b981' },
        { id: 4, name: 'Group Challenges', icon: 'trophy', color: '#f59e0b' }
      ]
    }
  ];

  // Current user
  currentUser: User = {
    id: 1,
    name: 'You',
    avatar: 'Y',
    skillsToTeach: [],
    skillsToLearn: [],
    level: 'Intermediate',
    rating: 4.8,
    online: true
  };

  // Available users for matching (simulated database)
  availableUsers: User[] = [
    { id: 2, name: 'Alex Chen', avatar: 'AC', skillsToTeach: ['JavaScript', 'React'], skillsToLearn: ['UI/UX Design', 'Spanish'], level: 'Advanced', rating: 4.9, online: true },
    { id: 3, name: 'Maria Rodriguez', avatar: 'MR', skillsToTeach: ['Spanish', 'Cooking'], skillsToLearn: ['Web Development', 'Photo Editing'], level: 'Intermediate', rating: 4.7, online: true },
    { id: 4, name: 'Jamie Smith', avatar: 'JS', skillsToTeach: ['UI/UX Design', 'Graphic Design'], skillsToLearn: ['JavaScript', 'Music Production'], level: 'Expert', rating: 5.0, online: false },
    { id: 5, name: 'Taylor Wong', avatar: 'TW', skillsToTeach: ['Music Production', 'Guitar'], skillsToLearn: ['Data Science', 'Fitness'], level: 'Intermediate', rating: 4.5, online: true },
    { id: 6, name: 'Jordan Lee', avatar: 'JL', skillsToTeach: ['Data Science', 'Python'], skillsToLearn: ['Graphic Design', 'Cooking'], level: 'Advanced', rating: 4.8, online: true },
    { id: 7, name: 'Casey Kim', avatar: 'CK', skillsToTeach: ['Fitness', 'Nutrition'], skillsToLearn: ['Web Development', 'Spanish'], level: 'Expert', rating: 4.9, online: true },
    { id: 8, name: 'Riley Patel', avatar: 'RP', skillsToTeach: ['Photo Editing', 'Photography'], skillsToLearn: ['UI/UX Design', 'Music Production'], level: 'Intermediate', rating: 4.6, online: false }
  ];

  // Matched rooms
  matchedRooms: MatchedRoom[] = [];

  // Potential matches (found during matching process)
  potentialMatches: Array<{
    user: User;
    skill: string;
    matchType: 'learn' | 'teach';
    matchScore: number;
    compatibility: number;
  }> = [];

  // Matching state
  isMatching = false;
  matchProgress = 0;
  currentMatchIndex = 0;
  showMatchingResults = false;
  showMatchedRooms = false;

  // Practice rooms data
  practiceRooms = [
    {
      id: 1,
      title: 'Build a Landing Page in 60 Minutes',
      skill: 'Web Development',
      level: 'Beginner',
      participants: 8,
      maxParticipants: 12,
      duration: '60 min',
      type: 'LIVE PRACTICE',
      features: ['Voice + Screen', 'Real-time Help', 'Peer Review'],
      color: '#3b82f6'
    },
    {
      id: 2,
      title: 'Design a Mobile App Interface',
      skill: 'UI/UX Design',
      level: 'Intermediate',
      participants: 5,
      maxParticipants: 10,
      duration: '90 min',
      type: 'DESIGN SPRINT',
      features: ['Figma Collaboration', 'Design Critique', 'Assets Provided'],
      color: '#8b5cf6'
    },
    {
      id: 3,
      title: 'Learn Spanish Conversation Basics',
      skill: 'Languages',
      level: 'Beginner',
      participants: 12,
      maxParticipants: 15,
      duration: '45 min',
      type: 'LANGUAGE LAB',
      features: ['Voice Chat', 'Native Speaker', 'Real Scenarios'],
      color: '#10b981'
    },
    {
      id: 4,
      title: 'JavaScript Algorithms Practice',
      skill: 'Web Development',
      level: 'Advanced',
      participants: 6,
      maxParticipants: 8,
      duration: '75 min',
      type: 'CODE CHALLENGE',
      features: ['Pair Programming', 'Code Review', 'Optimization Tips'],
      color: '#f7df1e'
    }
  ];

  // User skills with progress
  userSkills = [
    { name: 'Web Development', level: 72, icon: 'code', color: '#3b82f6', proofs: 3 },
    { name: 'UI/UX Design', level: 45, icon: 'palette', color: '#8b5cf6', proofs: 2 },
    { name: 'Spanish', level: 30, icon: 'language', color: '#10b981', proofs: 1 }
  ];

  // Community feed
  communityFeed = [
    { user: 'Alex Chen', action: 'helped', target: 'Maria Rodriguez', skill: 'JavaScript', time: '5 min ago' },
    { user: 'Skill Fusion', action: 'started', target: 'Weekly Challenge', skill: 'Web Development', time: '1 hour ago' },
    { user: 'Jamie Smith', action: 'unlocked', target: 'Advanced Level', skill: 'UI Design', time: '2 hours ago' },
    { user: 'Taylor Wong', action: 'completed', target: '7-Day Challenge', skill: 'React.js', time: '3 hours ago' }
  ];

  // Challenges
  challenges = [
    {
      title: '7-Day Skill Fusion Challenge',
      description: 'Build & Deploy a Real Website',
      participants: 124,
      duration: '7 days',
      endsIn: '3 days',
      color: '#3b82f6'
    },
    {
      title: 'Design System Marathon',
      description: 'Create a Complete Design System',
      participants: 87,
      duration: '5 days',
      endsIn: '1 day',
      color: '#8b5cf6'
    },
    {
      title: '30-Day Language Sprint',
      description: 'Reach Conversational Fluency',
      participants: 256,
      duration: '30 days',
      endsIn: '15 days',
      color: '#10b981'
    }
  ];

  // Skill page tabs
  skillTabs = ['Overview', 'Practice', 'Teach', 'Community', 'Challenges', '1-on-1'];
  activeTab = 'Overview';

  // UI state
  showOnboarding = true;
  currentStep = 0;
  skillCredits = 350;
  activeSkillPage = 'Web Development';

  // Room scheduling
  selectedDuration = 30;
  roomTopic = '';

  constructor() { }

  ngOnInit(): void {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('skillFusionOnboarding');
    if (hasCompletedOnboarding) {
      this.showOnboarding = false;
      // Load any existing matched rooms
      this.loadExistingRooms();
    }
  }

  selectOption(stepIndex: number, optionId: number): void {
    const step = this.onboardingSteps[stepIndex];
    const index = step.selected.indexOf(optionId);

    if (index === -1) {
      step.selected.push(optionId);
    } else {
      step.selected.splice(index, 1);
    }
  }

  nextStep(): void {
    if (this.currentStep < this.onboardingSteps.length - 1) {
      this.currentStep++;
    } else {
      this.completeOnboarding();
    }
  }

  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  completeOnboarding(): void {
    // Store user's selected skills
    const learnSkills = this.onboardingSteps[0].selected.map(id => 
      this.onboardingSteps[0].options.find(opt => opt.id === id)?.name || ''
    ).filter(name => name);
    
    const teachSkills = this.onboardingSteps[1].selected.map(id => 
      this.onboardingSteps[1].options.find(opt => opt.id === id)?.name || ''
    ).filter(name => name);

    // Update current user with selected skills
    this.currentUser.skillsToLearn = learnSkills;
    this.currentUser.skillsToTeach = teachSkills;

    this.showOnboarding = false;
    localStorage.setItem('skillFusionOnboarding', 'completed');
    
    // Auto-start matching if user selected skills
    if (learnSkills.length > 0 || teachSkills.length > 0) {
      setTimeout(() => {
        this.startMatching();
      }, 1000);
    }
  }

  skipOnboarding(): void {
    this.showOnboarding = false;
    localStorage.setItem('skillFusionOnboarding', 'skipped');
  }

  // Matching algorithm
  startMatching(): void {
    this.isMatching = true;
    this.matchProgress = 0;
    this.potentialMatches = [];
    this.showMatchingResults = false;
    
    // Simulate matching process
    const interval = setInterval(() => {
      this.matchProgress += 10;
      if (this.matchProgress >= 100) {
        clearInterval(interval);
        this.performMatching();
        this.isMatching = false;
        this.showMatchingResults = true;
      }
    }, 200);
  }

  performMatching(): void {
    this.potentialMatches = [];
    
    // Find users who can teach what current user wants to learn
    this.currentUser.skillsToLearn.forEach(skill => {
      this.availableUsers.forEach(user => {
        if (user.skillsToTeach.includes(skill)) {
          const matchScore = this.calculateMatchScore(this.currentUser, user, skill, 'learn');
          if (matchScore > 0.5) { // Threshold for good match
            this.potentialMatches.push({
              user,
              skill,
              matchType: 'learn',
              matchScore,
              compatibility: Math.round(matchScore * 100)
            });
          }
        }
      });
    });
    
    // Find users who want to learn what current user can teach
    this.currentUser.skillsToTeach.forEach(skill => {
      this.availableUsers.forEach(user => {
        if (user.skillsToLearn.includes(skill)) {
          const matchScore = this.calculateMatchScore(this.currentUser, user, skill, 'teach');
          if (matchScore > 0.5) {
            this.potentialMatches.push({
              user,
              skill,
              matchType: 'teach',
              matchScore,
              compatibility: Math.round(matchScore * 100)
            });
          }
        }
      });
    });
    
    // Sort by best match
    this.potentialMatches.sort((a, b) => b.matchScore - a.matchScore);
  }

  calculateMatchScore(user1: User, user2: User, skill: string, type: 'learn' | 'teach'): number {
    let score = 0.5; // Base score
    
    // Level compatibility (similar levels work better together)
    const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    const levelDiff = Math.abs(levels.indexOf(user1.level) - levels.indexOf(user2.level));
    score += (3 - levelDiff) * 0.1;
    
    // Rating factor
    score += (user2.rating - 4) * 0.1;
    
    // Online status bonus
    if (user2.online) score += 0.15;
    
    // Skill specificity bonus (exact match vs category match)
    const skillOption = [...this.onboardingSteps[0].options, ...this.onboardingSteps[1].options]
      .find(opt => opt.name === skill);
    if (skillOption?.category) {
      // Check if users have other skills in same category
      const user1Skills = [...user1.skillsToLearn, ...user1.skillsToTeach];
      const user2Skills = [...user2.skillsToLearn, ...user2.skillsToTeach];
      const commonCategorySkills = user1Skills.filter(s1 => 
        user2Skills.includes(s1) && 
        this.getSkillCategory(s1) === skillOption.category
      ).length;
      score += commonCategorySkills * 0.05;
    }
    
    return Math.min(1, Math.max(0, score));
  }

  getSkillCategory(skillName: string): string {
    const skill = [...this.onboardingSteps[0].options, ...this.onboardingSteps[1].options]
      .find(opt => opt.name === skillName);
    return skill?.category || 'general';
  }

  createRoom(match: any): void {
    const roomCode = this.generateRoomCode();
    const newRoom: MatchedRoom = {
      id: this.matchedRooms.length + 1,
      skill: match.skill,
      user1: this.currentUser,
      user2: match.user,
      status: 'pending',
      roomType: '1-on-1',
      duration: this.selectedDuration,
      createdAt: new Date(),
      roomCode
    };
    
    this.matchedRooms.unshift(newRoom);
    this.showMatchingResults = false;
    this.showMatchedRooms = true;
    this.activeTab = '1-on-1';
    
    // Auto-schedule if both online
    if (match.user.online) {
      setTimeout(() => {
        this.startRoom(newRoom.id);
      }, 2000);
    }
  }

  createCustomRoom(): void {
    if (!this.roomTopic.trim()) return;
    
    // Find best match for the custom topic
    const bestMatch = this.potentialMatches.find(match => 
      match.skill.toLowerCase().includes(this.roomTopic.toLowerCase()) ||
      match.user.name.toLowerCase().includes(this.roomTopic.toLowerCase())
    ) || this.potentialMatches[0];
    
    if (bestMatch) {
      this.createRoom(bestMatch);
    } else {
      // Create room with first available user if no match found
      const availableUser = this.availableUsers.find(u => u.online);
      if (availableUser) {
        const roomCode = this.generateRoomCode();
        const newRoom: MatchedRoom = {
          id: this.matchedRooms.length + 1,
          skill: this.roomTopic,
          user1: this.currentUser,
          user2: availableUser,
          status: 'pending',
          roomType: '1-on-1',
          duration: this.selectedDuration,
          createdAt: new Date(),
          roomCode
        };
        
        this.matchedRooms.unshift(newRoom);
        this.showMatchedRooms = true;
        this.activeTab = '1-on-1';
        this.roomTopic = '';
      }
    }
  }

  startRoom(roomId: number): void {
    const room = this.matchedRooms.find(r => r.id === roomId);
    if (room) {
      room.status = 'active';
      room.scheduledTime = new Date();
      
      // Simulate joining a room
      alert(`Joining 1-on-1 room with ${room.user2.name} for ${room.skill}\nRoom Code: ${room.roomCode}`);
      
      // Auto-complete after duration
      setTimeout(() => {
        this.completeRoom(roomId);
      }, room.duration * 60 * 1000); // Convert minutes to milliseconds
    }
  }

  completeRoom(roomId: number): void {
    const room = this.matchedRooms.find(r => r.id === roomId);
    if (room) {
      room.status = 'completed';
      this.skillCredits += 50; // Reward for completed session
    }
  }

  generateRoomCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  loadExistingRooms(): void {
    // Simulate loading existing rooms from localStorage
    const savedRooms = localStorage.getItem('skillFusionRooms');
    if (savedRooms) {
      this.matchedRooms = JSON.parse(savedRooms);
    }
  }

  saveRooms(): void {
    localStorage.setItem('skillFusionRooms', JSON.stringify(this.matchedRooms));
  }

  joinRoom(roomId: number): void {
    alert(`Joining practice room ${roomId}`);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    if (tab === '1-on-1' && this.matchedRooms.length > 0) {
      this.showMatchedRooms = true;
    }
  }

  getCurrentStep(): any {
    return this.onboardingSteps[this.currentStep];
  }

  isOptionSelected(stepIndex: number, optionId: number): boolean {
    return this.onboardingSteps[stepIndex].selected.includes(optionId);
  }

  // Progress calculation for skill page
  getProgressData() {
    return {
      level: 'Intermediate',
      nextMilestone: 'Build a Full-Stack App',
      activePractitioners: 1248,
      roadmap: [
        { level: 'Beginner', tasks: ['HTML/CSS Basics', 'Basic JavaScript', 'Simple Website'] },
        { level: 'Intermediate', tasks: ['Frontend Framework', 'API Integration', 'Responsive Design'], current: true },
        { level: 'Advanced', tasks: ['Full-Stack Development', 'DevOps', 'Performance Optimization'] }
      ]
    };
  }

  // Helper method to get skill icon
  getSkillIcon(skillName: string): string {
    const allOptions = [...this.onboardingSteps[0].options, ...this.onboardingSteps[1].options];
    const skill = allOptions.find(opt => opt.name === skillName);
    return skill?.icon || 'question';
  }

  // Helper method to get skill color
  getSkillColor(skillName: string): string {
    const allOptions = [...this.onboardingSteps[0].options, ...this.onboardingSteps[1].options];
    const skill = allOptions.find(opt => opt.name === skillName);
    return skill?.color || '#3b82f6';
  }
}