export class AddSessionDto {
  readonly date: string;
  readonly session: Record<string, any>;
  readonly user: string;
}
