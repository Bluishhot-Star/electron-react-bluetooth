import axios from 'axios';
import { Cookies } from 'react-cookie';

export const refresh = function(callback){
    const cookies = new Cookies();
    const accessExpires = new Date();
    axios.get("/auth/renewal" , {
        headers: {
            Authorization: `Bearer ${cookies.get('refreshToken')}`
        }})
    .then(res =>{
        console.log(res.data.response.accessToken);
        accessExpires.setMinutes(accessExpires.getMinutes() + 14);
        cookies.set('accessToken',res.data.response.accessToken,{expires : accessExpires,secure:"true"});
        setTimeout(function(){
            refresh(null) ;
        }, (1000*60*14));
        
    })
    .catch((err)=>{
        console.log(err);
    });
    
};