/**
 * TODO (pablo.hurtado): This is left here temporarily as usage documentation.
 * You can also (and should) use async/await instead of `then`, but it was quicker for me to test this way.
 * Remove this file later.
 */
// import { isFailedResponse, MMMHubClient } from "./mmmhub-client";

// type AdminInvitedAttrs = {
//     EventType: 'AdminInvited',
//     Country: string,
//     Language: string,
//     Brand: string,
//     ButtonURL: string,
//     FirstName: string
// };

// type UserInvitedAttrs = {
//     EventType: 'UserInvited',
//     Country: string,
//     Language: string,
//     Brand: string,
//     ButtonURL: string,
//     FirstName: string,
//     AdminName: string
// }

// type UserDisabledAttrs = {
//     EventType: 'UserDisabled',
//     Country: string,
//     Language: string,
//     Brand: string,
//     ButtonURL: string,
//     FirstName: string,
//     FullName: string,
//     Location: string,
//     UserTitle: string,
//     Department: string,
//     Function: string,
//     DisableReason: string
// }

// const client = new MMMHubClient('<SubscriberKey>', 'https://api-dev.adecco.com/mmmhub');
// const eventType = 'UserDisabled';
// const commonAttrs = {
//     Country: 'CH',
//     Language: 'EN',
//     Brand: 'Adecco',
//     ButtonURL: 'https://www.google.com'
// };
// client.sendEmail<UserDisabledAttrs>({
//     definitionKey: 'API_Email_Global_ClientAccess',
//     recipients: [
//         {
//             to: 'demo.account@adeccogroup.com',
//             contactKey: 'demo.account@adeccogroup.com',
//             attributes: {
//                 EventType: eventType,
//                 FirstName: 'Test',
//                 FullName: 'Test This',
//                 Location: 'Somewhere',
//                 UserTitle: 'Time waster',
//                 Department: 'A Department',
//                 Function: 'A Function',
//                 DisableReason: 'Bad behavior',
//                 ...commonAttrs
//             }
//         }
//     ]
// }).then(r => {
//     if (isFailedResponse(r)) {
//         console.log(`Call failed! Status Code: ${r.status}. Message: ${r.message}`);
//     }
//     else {
//         console.log(`Message key(s): ${r.responses.flatMap(i => i.messageKey)}`);
//         setTimeout(() => {
//             client.checkEmailSendStatus(r.responses[0].messageKey).then(statusResponse => {
//                 if (isFailedResponse(statusResponse)) {
//                     console.log(`Check email status failed! ${statusResponse.message}`);
//                 } else {
//                     console.log(`Was first email sent?: ${statusResponse.eventCategoryType}`);
//                 }
//             });
//         }, 10000);
//     }
// });
