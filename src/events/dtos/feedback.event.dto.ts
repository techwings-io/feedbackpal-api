export class FeedbackEventDto {
  id: string;
  eventName: string;
  description: string;
  validFrom: Date;
  validTo: Date;
  createdBy: string;
  email: string;
  publicEvent: boolean;
  usersToShareWith: string[];
  lastCreated: Date;
  lastUpdated: Date;
  totalHappy: number;
  totalNeutral: number;
  totalUnhappy: number;
  totalFeedbacks: number;
}
