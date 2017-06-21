interface SMSMessage {
  customer: string;
  recipients: string[];
  sender: string;
  message: string;
}


export default SMSMessage;
