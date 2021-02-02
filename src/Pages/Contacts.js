import { useState } from 'react'
import { Grid, Paper, 
         Container, TablePagination } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { useContacts } from './useContacts'
import { ContactsTable } from '../Components/Table/ContactsTable'
import { ContactInfo } from '../Components/ContactInfo/ContactInfo'
import Switch from '../Components/Switch/Switch'

const useStyles = makeStyles((theme) => ({
   root: {
     marginTop: theme.spacing(3),
   },
 }))

export const Contacts = () => {
   const classes = useStyles()
   const [ isDataSelected, setIsDataSelected ] = useState(false)
   const [ isRowSelected, setIsRowSelected ] = useState(false)
   const [ sortDirection, setSortDirection ] = useState(true)
   const [ fieldData, setfieldData ] = useState('')
   const [ contactInfo, setContactInfo ] = useState('')
   const [ url, setUrl ] = useState('')
   const contacts = useContacts( url )
   const [page, setPage] = useState(0)
   const [rowsPerPage] = useState(50)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  }

   const totalUsersCount = contacts.data.length
   const indexOfFirsRow = page * rowsPerPage 
   const indexOfLasRow = (page + 1) *  rowsPerPage  
   const currentUsers = contacts.data.slice(indexOfFirsRow, indexOfLasRow)

   const onSort = (field) => {
      const copyData = contacts.data.concat()
      setSortDirection(!sortDirection)

      let sort 
      if (sortDirection) {
         sort = copyData.sort(
            (a, b) => { return a[field] > b[field] ? 1 : -1 }
         )
      } sort = copyData.reverse(
         (a, b) => { return a[field] > b[field] ? 1 : -1 }
      )
      contacts.setData(sort)
   }
   const showInfo = (field) => {
      setContactInfo(field)
      setIsRowSelected(true)
   }
   const handleSwitch = (url) => {
      setUrl(url)
      setIsDataSelected(true)
   }
 
   return ( 
      <Container className={classes.root}>
         <Grid container spacing={3} style={{display: "flex", justifyContent: "center"}}>
            {(!isDataSelected) ? <Switch handleSwitch={handleSwitch}/>
               : <>
                  <Grid item xs={12}>
                     <Paper> Add contact </Paper>
                  </Grid>
                  <Grid item xs={12}>
                     <Paper> Search </Paper>
                  </Grid>
                  <Grid item xs={12}>
                     <TablePagination 
                        component="div"
                        rowsPerPageOptions={[50]}
                        count={totalUsersCount}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        />
                  </Grid>
                  <Grid item xs={12}>
                     {(() => {
                        if (contacts.isLoading) {
                           return <div> ...loading </div>
                        }
                        if (contacts.isError) {
                           return <div> error! </div>
                        }
                        return <ContactsTable 
                           data = {currentUsers}
                           onSort = {onSort}
                           sortDirection = {sortDirection}
                           showInfo = {showInfo}
                           setfieldData ={setfieldData}
                           fieldData ={fieldData}
                           />
                     })()}
                  </Grid>
                  { isRowSelected ? <Grid item xs={12}>
                     <ContactInfo contactInfo={contactInfo}/> 
                  </Grid> : null }
               </>}
         </Grid> 
      </Container>
   )
}