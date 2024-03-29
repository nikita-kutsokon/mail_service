"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const modifyEmailTextWithUniqueValues = (emailText, { contactId, emailId }) => {
    const newUnsubscribeLink = `frontendURL?contactId=${contactId}`;
    const eduQuestLink = `http://52.59.202.2:3000/action/email-link-tracking?emailId=${emailId}&linkName=EduQuest`;
    const nobelInternshipLink = `http://52.59.202.2:3000/action/email-link-tracking?emailId=${emailId}&linkName=Nobel-Internship`;
    const imgTag = `<img src="http://52.59.202.2:3000/action/email-open-tracking?emailId=${emailId}" alt="pixel">`;
    // const unsubscribeLinkRegex = /(<a[^>]*href=")[^"]*("[^>]*>Unsubscribe<\/a>)/;
    const eduQuestLinkRegex = /(<a[^>]*href=")[^"]*("[^>]*>EduQuest Website<\/a>)/;
    const nobelInternshipLinkRegex = /(<a[^>]*href=")[^"]*("[^>]*>Nobel-Internship Website<\/a>)/;
    // let modifiedEmailText = emailText.replace(unsubscribeLinkRegex, `$1${newUnsubscribeLink}$2`);
    let modifiedEmailText = emailText.replace(eduQuestLinkRegex, `$1${eduQuestLink}$2`);
    modifiedEmailText = modifiedEmailText.replace(nobelInternshipLinkRegex, `$1${nobelInternshipLink}$2`);
    modifiedEmailText = modifiedEmailText.replace('</body>', `${imgTag}</body>`);
    return modifiedEmailText;
};
const generateAllLinksThatTrakingForMailTemplate = (mailId) => {
    const generatedLinks = new Map();
    for (const linkName in config_1.trackingLinks) {
        const trakingLink = `http://${process.env.SERVER_DOMAIN}/mail-traking/${mailId}/link-clicking/${linkName}`;
        generatedLinks.set(linkName, trakingLink);
    }
    return generatedLinks;
};
const generateLinkThatTrakOpeningOfMail = (mailId) => {
    return `http://${process.env.SERVER_DOMAIN}/mail-traking/${mailId}/opened`;
};
const decorateMailTemplateWithTrakingFeature = (mailText, mailId) => {
    let modifiedMailText = mailText;
    const oppeningTrakingLink = generateLinkThatTrakOpeningOfMail(mailId);
    const trackingLinks = generateAllLinksThatTrakingForMailTemplate(mailId);
    for (const linkName in trackingLinks) {
        modifiedMailText.replace(`/(<a[^>]*href=")[^"]*("[^>]*>${linkName}<\/a>)/`, `$1${trackingLinks.get(linkName)}$2`);
    }
    const spyImageTag = `<img src="${oppeningTrakingLink}" alt="pixel">`;
    modifiedMailText.replace('</body>', `${spyImageTag}</body>`);
    return modifiedMailText;
};
exports.default = decorateMailTemplateWithTrakingFeature;
//# sourceMappingURL=traking-mail-decorator.js.map