import moment from 'moment';
import prismaClient from '../../database/prisma-client';

const retrievePendingMails = async () => {
    const currentDateTimeUTC = moment.utc().toDate();
    
    const pendingMails = await prismaClient.scheduledMail.findMany({
        where: {
            scheduledDate: {
                lt: currentDateTimeUTC
            }
        }
    });

    return pendingMails;
};

const deletePendingMail = async (id: string) => {
    const mail = await prismaClient.scheduledMail.delete({
        where: {
          id,
        },
      })

      return mail
}

export default {
    retrievePendingMails,
    deletePendingMail
};