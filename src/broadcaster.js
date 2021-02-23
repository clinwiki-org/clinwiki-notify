import nodemailer from 'nodemailer';
import path from 'path';
import pug from 'pug';
import logger from './util/logger';
import config from '../config';


export function mailResults(email,results) {
    try {
        if(results.length === 0) {
            return;
        }
        let templateFunction = pug.compileFile(path.join(__dirname, './views/savedSearchEmail.pug'));
        let body = templateFunction({results,weburl: config.webUrl});
        sendEmail(
          email,
          'Clinwiki Search Results',
          body
        );    
    }
    catch(err) {
        logger.error(err);
    }
}

function sendEmail(sendTo,subject,body,replyTo) {
    let transport = nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort,
        auth: {
          user: config.smtpUser,
          pass: config.smtpPassword
        }
      });

      let mailOptions = {
        from: config.outboundEmail,
        to: sendTo,
        subject: subject,
        html: body
      };
      if(replyTo) {
        mailOptions.replyTo = replyTo;
      }
  
      transport.sendMail(mailOptions, (error,info) => {
        if(error) {
          logger.error(error);
          return;
        }
        logger.info('Email summary sent to '+sendTo);
      });
}