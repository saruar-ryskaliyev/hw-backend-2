export interface User {
    _id: string;
    email: string;
    username: string;
  }
  
  export interface Message {
    user: User;
    content: string;
  }
  