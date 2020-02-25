import React, {useState, useEffect, useRef} from 'react';
import { Route, Switch, BrowserRouter, Redirect, NavLink, Link } from 'react-router-dom';
import {useHistory, useLocation, useRouteMatch, useParams} from 'react-router'
import './App.scss';
import {api} from './api'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Call it once in your app. At the root of your app is the best place

function App() {
  useEffect(()=>{
    toast.configure()
  },[])
  return (
    <div className="App">
      <BrowserRouter>
      <header className="App-header">
        <NavLink activeClassName="active" to="/contacts">contacts</NavLink>
        <NavLink to="/history">history</NavLink>
      </header>
      <main>
        <Switch>
          <Route path="/contacts" component={Contacts}/>
          <Route path="/history" component={History}/>
          <Redirect to="/contacts"/>
        </Switch>
      </main>
      </BrowserRouter>
    </div>
  );
}

function Contacts(){
  const {url, path} = useRouteMatch()
  return(
    <Switch>
      <Route path={`${path}/:contactId/compose`} component={Compose} />
      <Route path={`${path}/:contactId`} component={ContactDetail} />
      <Route path="/" component={ContactList}/>
      <Redirect to="/" />
    </Switch>
  )
}

function ContactDetail(){
  const [contactDetail, setContactDetail] = useState(null)
  const [loading, setLoading] = useState([])
  const { contactId } = useParams()
  const {push} = useHistory()
  useEffect(() => {
    async function getContactDetail() {
      const response = await fetch(`http://localhost:3000/contacts/${contactId}`)
      const result = await response.json()
      setContactDetail(result)
    }
    getContactDetail()
  }, [])

  return(
    <div className="user-card">
      {contactDetail && <div>
        <div className="row"><b>First Name</b> <span>{contactDetail.firstName}</span></div>
        <div className="row"><b>Last Name</b> <span>{contactDetail.lastName}</span></div>
        <div className="row"><b>Phone No.</b> <span>{contactDetail.contact}</span></div>
        <button type="button" onClick={e=>push(`/contacts/${contactId}/compose`)}> Send OTP</button>
      </div>}
    </div>

  )
}

function generateOtp(otpLength = 6) {
  let baseNumber = Math.pow(10, otpLength - 1);
  let number = Math.floor(Math.random() * baseNumber);
  if (number < baseNumber) {
    number += baseNumber;
  }
  return number;
};

function Compose(){
  const [contactDetail, setContactDetail] = useState(null)
  const otp = useRef(generateOtp())
  const [loading, setLoading] = useState([])
  const { contactId } = useParams()
  useEffect(() => {
    async function getContactDetail() {
      const result = await api(`/contacts/${contactId}`)
      setContactDetail(result)
    }
    getContactDetail()
  }, [])

  async function handleSubmit(e){
    e.preventDefault()
    const history = await api('/history')
    await api(`/history`, {time: new Date(), otp: otp.current, id: history.length + 1 , contactId: Number(contactId), firstName: contactDetail.firstName, lastName: contactDetail.lastName})
    toast.success('OTP sent.')
  }

  return(
    <form onSubmit={handleSubmit}>
      <textarea value={`Hi. Your OTP is: ${otp.current}`}>

      </textarea>
      <button type="submit">Send</button>
    </form>
  )
}

function ContactList(){
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState([])
  const { url, path } = useRouteMatch()
  console.log(url, path)
  useEffect(()=>{
    async function getContacts(){
      const result = await api('/contacts')
      setContacts(result)
    }
    getContacts()
  },[])

  return(
    <table cellspacing="0" cellpadding="0">
      <thead>
        <tr>
          <th align="left">Name</th>
          <th align="left">Phone No.</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map(({firstName, lastName, contact, id})=><tr key={id}>
          <Td to={`/contacts/${id}`}>{firstName} {lastName}</Td>
          <Td to={`/contacts/${id}`}>{contact}</Td>
        </tr>)}
      </tbody>
    </table>
  )
}

function History(){
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState([])
  useEffect(() => {
    async function getHistory() {
      const result = await api(`/history?_sort=time&_order=desc`)
      setHistory(result)
    }
    getHistory()
  }, [])

  return(
    <table cellspacing="0" cellpadding="0">
      <thead>
        <tr>
          <th align="left">Name</th>
          <th align="left">Time</th>
          <th align="left">Otp</th>
        </tr>
      </thead>
      <tbody>
        {history.map(({ firstName, lastName, time, otp, id }) => <tr key={id}>
          <Td>{firstName} {lastName}</Td>
          <Td>{time}</Td>
          <Td>{otp}</Td>
        </tr>)}
      </tbody>
    </table>
  )
}

function Td({ children, to = null, ...props }) {
  const ContentTag = to ? Link : 'div';
  return (
    <td>
      <ContentTag to={to} {...props}>{children}</ContentTag>
    </td>
  );
}

export default App;
