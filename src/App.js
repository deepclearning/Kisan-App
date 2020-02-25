import React, {useState, useEffect} from 'react';
import { Route, Switch, BrowserRouter, Redirect, NavLink, Link } from 'react-router-dom';
import {useHistory, useLocation, useRouteMatch, useParams} from 'react-router'
import logo from './logo.svg';
import './App.scss';

function App() {
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
  useEffect(() => {
    async function getContactDetail() {
      const response = await fetch(`http://localhost:3000/contacts/${contactId}`)
      const result = await response.json()
      setContactDetail(result)
    }
    getContactDetail()
  }, [])

  return(
    <div>
      {contactDetail && <div>
        <div><b>First Name</b> <span>{contactDetail.firstName}</span></div>
        <div><b>Last Name</b> <span>{contactDetail.lastName}</span></div>
        <div><b>Phone No.</b> <span>{contactDetail.contact}</span></div>
      
      </div>}
    </div>

  )
}

function ContactList(){
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState([])
  const { url, path } = useRouteMatch()
  console.log(url, path)
  useEffect(()=>{
    async function getContacts(){
      const response = await fetch('http://localhost:3000/contacts')
      const result = await response.json()
      setContacts(result)
    }
    getContacts()
  },[])

  return(
    <table>
      <thead>
        <tr>
          <th align="left">Name</th>
          <th align="left">Phone No.</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map(({firstName, lastName, contact, id})=><tr key={id}>
          <Td to={`${path}${id}`}>{firstName} {lastName}</Td>
          <Td to={`${path}${id}`}>{contact}</Td>
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
      const response = await fetch('http://localhost:3000/history')
      const result = await response.json()
      setHistory(result)
    }
    getHistory()
  }, [])

  return(
    <table>

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
