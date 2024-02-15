import { Contact } from '@prisma/client';

import staticPlaceholderHandlers from './handlers/static-data.handlers';
import dynamicPlaceholderHandlers from './handlers/dynamic-data.handlers';

const replacePlaceholders = async (text: string, contactData: Contact) => {
    const placeholderIdentifierRegex = /%(\w+)%/g;
    const replacements = await Promise.all(
        Array.from(text.matchAll(placeholderIdentifierRegex), async ([match, placeholder]) => {
            const handler = staticPlaceholderHandlers[`%${placeholder}%`] || dynamicPlaceholderHandlers[`%${placeholder}%`];
            const result = handler ? await handler(contactData) : match;

            return { match, result };
        })
    );

    let formattedMailText = text;
    replacements.forEach(({ match, result }) => {
        formattedMailText = formattedMailText.replace(match, result);
    });

    return formattedMailText;
};

export default {
    replacePlaceholders
};