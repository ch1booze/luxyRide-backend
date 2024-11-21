export class SignupDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class LoginDto {
  email: string;
  password: string;
}

export class SignupResult {
  accessToken: string;
  refreshToken: string;
}
