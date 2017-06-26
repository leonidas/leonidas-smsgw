interface SMSMessage {
  recipients: string[];
  message: string;
  customer?: string;
  sender?: string;
}


export default SMSMessage;
