import { Prisma } from '@prisma/client';
import prismaClient from '../../database/prisma-client';

const createContact = async (contactData: Prisma.ContactCreateManyInput[]) => {
    const result = await prismaClient.contact.createMany({ data: contactData });
    return result;
};

const deleteContactById=async(id:string)=>{
    const result=await prismaClient.contact.delete({where:{id}});
    return result;
};

const updateContactById = async (id: string, contactData: Prisma.ContactUpdateInput) => {
    const result = await prismaClient.contact.update({ where: { id }, data: contactData });
    return result;
};

const getContactById = async (id:string)=>{
    const result=await prismaClient.contact.findUnique({where:{id}});
    return result;
};

const getContactList = async (filteringParams: ApiResourceFilteringParams) => {
    const { search, page, pageSize } = filteringParams;
    const skip = (page - 1) * pageSize;

    const whereCondition = {
        OR: [
            { email: { contains: search } },
            { firstName: { contains: search } },
            { lastName: { contains: search } },
        ],
    };

    const contacts = await prismaClient.contact.findMany({
        skip,
        take: pageSize,
        where: whereCondition,
    });

    const contactsCount = await prismaClient.contact.count()

    return {
        contacts,
        contactsCount
    };
};  

const batchUpdatingContacts = async (updatingData: { contactIds: string[], updates: Prisma.ContactUpdateInput }) => {
    const { contactIds, updates } = updatingData;

    const result = await prismaClient.contact.updateMany({
        where: {
            id: {
                in: contactIds,
            },
        },
        data: updates,
    });

    return result;
};


const batchDeletingContacts = async (deletingData: { contactIds: string[] }) => {
    const result = await prismaClient.contact.deleteMany({
        where: {
            id: {
                in: deletingData.contactIds,
            },
        },
    });

    return result;
};

const addTotheList = async (contactData: Prisma.ContactCreateInput) => {
    const { id, eduQuestSelectedDateTime } = await prismaClient.contact.create({
        data: contactData
    })

    
}

export default{
    createContact,
    getContactById,
    getContactList,
    deleteContactById,
    updateContactById,
    batchUpdatingContacts,
    batchDeletingContacts,
};
