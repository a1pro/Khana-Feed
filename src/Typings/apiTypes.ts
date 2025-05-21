export interface LoginResponse {
    access_token: string;
  }
  
  export interface EmployeeProfileResponse {
    username: any;
    success: boolean;
    status_code: number;
    data: {
      username: string;
      company: string;
      designation: string;
    };
  }
  
  export interface AttendanceResponse {
    success: boolean;
    status_code: number;
    message: string;
    data: {
      user_id: number;
      company_id: number;
      employee_id: number;
      date: string;
      clock_in: string;
      updated_at: string;
      created_at: string;
      id: number;
    };
  }
  
  export interface ChangePasswordResponse {
    success: boolean;
    status_code: number;
    message: string;
  }
  