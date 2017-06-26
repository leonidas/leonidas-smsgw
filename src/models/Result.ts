export interface RecipientResult {
  recipient: string;
  success: boolean;
  statusMessage?: string;
}


interface Result {
  /**
   * true if all recipients were successfully sent to; false otherwise
   */
  success: boolean;

  /**
   * per-recipient results
   */
  recipients: RecipientResult[];
}


export default Result;
