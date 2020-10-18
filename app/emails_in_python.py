MY_EMAIL = 'ffeenon@gmail.com'

email_subject = 'a msg from python'
email_msg = "hi, I'm from python"

# send
import smtplib, getpass

smtp_object = smtplib.SMTP('smtp.gmail.com', 587)
smtp_object.ehlo()
smtp_object.starttls()
print('smtp server connected!')

email = MY_EMAIL
password = getpass.getpass('password')
smtp_object.login(email, password)

print('login success!')

from_address = MY_EMAIL
to_address = MY_EMAIL
subject = email_subject
message = email_msg
msg = "Subject: " + subject + '\n' + message
smtp_object.sendmail(from_address,to_address,msg)

print(f'email send! subject:{subject}, msg:{message}')

smtp_object.quit()

# receive
import imaplib, email, getpass
M = imaplib.IMAP4_SSL('imap.gmail.com')
print('imap server connected!')

user = MY_EMAIL
M.login(user,password)
print('login success!')

M.select("inbox")
typ ,data = M.search(None,f'SUBJECT "a msg from python"')

print(f'data:{data}')

result, email_data = M.fetch(data[0].split()[0],"(RFC822)")
raw_email = email_data[0][1]
raw_email_string = raw_email.decode('utf-8')

email_message = email.message_from_string(raw_email_string)

for part in email_message.walk():
    if part.get_content_type() == "text/plain":
        body = part.get_payload(decode=True)
        print(f"result email content:{body.decode('utf-8')}")

M.close()
M.logout()