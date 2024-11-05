import emailjs from '@emailjs/browser';
import axios from 'axios';
const PublicKey = process.env.REACT_APP_PUBLIC_KEY;
const baseUrl = process.env.REACT_APP_HOST;
export const notifyAdminForNewSubs = async ({form,type}) => {
    const templateId = type == 'newSub' ? 
    process.env.REACT_APP_EMAIL_TEMPLATE_ID : 
    process.env.REACT_APP_EMAIL_TEMPLATE_ID2
    emailjs.sendForm
        (
            process.env.REACT_APP_EMAIL_SERVICE_ID,
            templateId,
            form.current,
            { publicKey: PublicKey }
        ).then((result) => {
            console.log(result)
            return { status: 'success' };
        },
            (error) => {
                console.log(error)
                return { status: 'failed' };
            })

}
export const addNewSub = async ({ email }) => {
    try 
    {
        const response = await axios.post(`${baseUrl}/subscriber/newSub`, { email: email });
        console.log(response)
        return response.data;
    }
    catch (error) 
    {
        console.log(error)
        return error.response.data;
    }
}