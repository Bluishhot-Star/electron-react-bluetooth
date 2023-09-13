import { useState, useCallback, useEffect} from 'react';
import axios from 'axios';
import { Cookies, useCookies } from 'react-cookie';
import { useInView } from 'react-intersection-observer';
import Alert from "../components/Alerts.js"

const MngClncs = () =>{
  const [clinicians, setClinicians] = useState([]);


  const cookie = new Cookies();
  const [loading, setLoading] = useState(false)
  const [ref, inView] = useInView();
  const [page, setPage] = useState(1); // 현재 페이지 번호 (페이지네이션)
  const [searchVal, setSearchVal] = useState("")

  const cliniciansList = useCallback(async () => {
    setLoading(true)
    axios.get(`/clinicians?page=${page}&size=10&name=${searchVal}`,{
      headers: {
        Authorization: `Bearer ${cookie.get('accessToken')}`
      }}).then((res)=>{
        console.log(res.data.response.clinicians);
        console.log(res.data.subCode);
        if(res.data.subCode !== 2004){
          setClinicians([...clinicians, ...res.data.response.clinicians]);
          setPage((page) => page + 1);
        }
      }).catch((err)=>{
        console.log(err);
      });
    setLoading(false)
  },[page])

  useEffect(()=>{
    cliniciansList()
  },[clinicians])

  // useEffect(() => {
  //   // 사용자가 마지막 요소를 보고 있고, 로딩 중이 아니라면
   
  //   if (inView && !loading) {
  //     setPage((page) => page + 1);
  //   }
  // }, [inView,loading])

  
  const statusChange = (e,id) =>{
    console.log(e.target.value);
    console.log(id);
    // axios.put(`/clinicians/${id}`,{
    //   headers: {
    //     Authorization: `Bearer ${cookie.get('accessToken')}`
    //   }},{
    //     status : e.target.value
    //   }).then((res)=>{
    //   }).catch((err)=>{
    //   console.log(err);
    //   });
  }

  return(
    <div>
      
      <div>
        {
          clinicians.map((item)=>{
            return(
              <div>
                <div>{item.clinicianName}</div>
                <div>{item.date}</div>
                <div>{item.roleName}</div>
                <div>{item.status==='enabled' ? '승인': '비승인'}</div>
                <div>
                  <label htmlFor="enable">승인</label>
                  <input type='radio' defaultChecked={item.status === "enabled" ? true : false} name={item.clinicianId} className='statusTrue' value='true' onChange={(e)=>{statusChange(e,item.clinicianId)}}/>
                  <label htmlFor="disable">거부</label>
                  <input type='radio' defaultChecked={item.status === "disabled" ? true : false} name={item.clinicianId} className='statusFalse'value='false' onChange={(e)=>{statusChange(e,item.clinicianId)}}/>
                </div>
              </div>
            )
          })
        }
      </div>
      <div ref={ref}></div>

      <div className="search-patient-container">
        <form 
            onSubmit={(e)=>{
            e.preventDefault(); // 전체 리렌더링 방지
            setClinicians([])
            cliniciansList();
            setPage(1);}}>
          <input type="text" placeholder='찾고자하는 매니저를 검색해주세요.'
          onChange={(e)=>{setSearchVal(e.target.value);}}/>
        </form>
      </div>
    </div>
  );
}

export default MngClncs;