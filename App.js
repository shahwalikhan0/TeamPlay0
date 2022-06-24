import React, { useEffect, useState } from 'react'
import { useMutation, useLazyQuery } from '@apollo/client'
import { GET_USERS } from '../GraphQL/Queries'
import { ADD_COMPANY, DELETE_COMPANY, EDIT_COMPANY } from '../GraphQL/Mutations'
import { changeStatus } from '../Functions/functions'

function Company () {
  const [formData, setFormData] = useState({})
  const [responsiveDashboard, setResponsiveDashboard] = useState('col-12') 
  const [searchData, setSearchData] = useState(<tr></tr>)
  const [tableHide, setTableHide] = useState('')
  const [hide, setHide] = useState('hide')
  const [disable, setDisable] = useState('')
  const [editCompanyId, setEditCompanyId] = useState(null)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [searchInput, setSearchInput] = useState('')

////////////////////////////////  fill data from INPUTS into formData object  ////////////////////////////////
  const onChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value
    })
  }
////////////////////////// async function working on useEffect whenever a formData changes   ////////////////
  const sendRequests = async() => {
    let temp = "Select Classification"
    if (
      !formData.name ||
      !formData.code ||
      formData.classification === temp ||
      !formData.classification
      ) {
            console.log('Form Data: ',formData)
            return
    }
    if (editCompanyId === null) {
        await createCompanyTemplate({
            variables: {
            ...formData
            }
        })
        if(errorDuringCreating)
            console.log(errorDuringCreating);
        setInputsToNull()
        setFormData({});

    } else {
        const toBeSendFormData = JSON.parse(JSON.stringify(formData)) // Object.create(formData)
        delete toBeSendFormData?.code;
            await editCompanyTemplate({
            variables: {          
                id: editCompanyId,
            ...toBeSendFormData
            }
        })
        if(errorDuringUpdating)
            console.log(errorDuringUpdating);
    }
    getCompanies()
  }
  useEffect(()=>{
    sendRequests()
  }, [formData])

///////////////////////////////////  hide create company template form  ////////////////////////////////////
  const hideTemplate = () => {
    setResponsiveDashboard('col-12')
    setHide('hide')
    setInputsToNull()
    setFormData({})
    setEditCompanyId(null)
  }

/////////////////////////////////////  show create company template   //////////////////////////////////////
  const showTemplate = () => {
    setResponsiveDashboard('col-6')
    setDisable(false)
    setHide('')
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const setInputsToNull = () => {
    setCode('')
    setName('')
    setDescription('')
  }
  const setInputsToFormData = () => {
    setCode(formData.code)
    setName(formData.name)
    setDescription(formData.description)
  }
  ////////////////////////////////  Fill the table from the fetched data   ///////////////////////////////////
  function GetAllCompanies () {
    if (isLoading) return 
        <tr>
            <td>Loading data...</td>
        </tr>
    if (errorDuringFetch) return 
        <tr>
            <td>Error: {errorDuringFetch}</td>
        </tr>
    return data?.companyTemplates?.data?.map(
      ({ id, code, name, classification }) => (
        <tr key={id} id={id}>
          <td className='td-1'>
            <i className='fa fa-building' />
          </td>
          <td className='td-id'>{id}</td>
          <td>{code}</td>
          <td>{name}</td>
          <td>{classification}</td>
          <td>
            <button className='fa fa-trash' onClick={() => DeleteCompany(id)} />
            <button
              className='fa fa-pencil'
              onClick={() => EditCompany(id, code, name, classification)}
            />
          </td>
        </tr>
      )
    )
  }

  /////////////////////////////  Query for Getting Company Data   ////////////////////////////////////////////
  const [getCompanies,{ loading: isLoading, error: errorDuringFetch, data }] = useLazyQuery(GET_USERS, { 
    fetchPolicy: 'network-only', 
    nextFetchPolicy: 'cache-first'
  })
  useEffect(() => {
    getCompanies()
  }, [])

  ////////////////////////////  Mutation for adding new Company   ////////////////////////////////////////////
  const [createCompanyTemplate, { error: errorDuringCreating }] = useMutation(
    ADD_COMPANY
  )

  ///////////////////////////  Mutation for deleting an existing Company  ////////////////////////////////////
  const [deleteCompanyTemplate, { error: errorDuringDeleting }] = useMutation(
    DELETE_COMPANY
  )

  function DeleteCompany (_id) {
    deleteCompanyTemplate({
      variables: {
        id: _id
      }
    })
    if (errorDuringDeleting) 
      console.log('errorDeleting', errorDuringDeleting)
    else 
      alert('Deleted Successfully')

    setEditCompanyId(null)
    getCompanies()
    setSearchData(<tr></tr>)
  }

////////////////////////////   Mutation for editing an existing Company  ///////////////////////////////////
  const [editCompanyTemplate, { error: errorDuringUpdating }] = useMutation(
    EDIT_COMPANY
  )

  function EditCompany (Id, Code, Name, Classification ) {
    showTemplate()
    formData.name = Name
    formData.code = Code
    formData.classification = Classification
    formData.description = 'Click to add description'
    setEditCompanyId(Id)
    setInputsToFormData();
    setDisable(true)
    setTableHide('')
    setSearchData(<tr></tr>)
  }

//////////////////////////////////////    Search Company By Code   ///////////////////////////////////////
const searchItem = (e) =>{
  if(!searchInput || e){
    setTableHide('')
    setSearchInput('')
    setSearchData(<tr></tr>)
    sendRequests()
    return;
  }
  setTableHide('hide')
  let flag = false, Code, Name, Id, Classification
  for(let i=0; i<data.companyTemplates.data.length && !flag; i++){
    if(searchInput === data.companyTemplates.data[i].code){  
      Code = data.companyTemplates.data[i].code
      Name = data.companyTemplates.data[i].name
      Id = data.companyTemplates.data[i].id
      Classification = data.companyTemplates.data[i].classification
      
      flag = true;
      setSearchData(<tr>
        <td className='td-1'>
          <i className='fa fa-building' />
        </td>
        <td className='td-id'>{data.companyTemplates.data[i].id}</td>
        <td >{Code}</td>
        <td >{Name}</td>
        <td >{Classification}</td>
        <td>
          <button className='fa fa-trash' onClick={() => DeleteCompany(Id)} />
          <button className='fa fa-pencil'
            onClick={() => EditCompany( Id, Code, Name, Classification )}
          />
        </td>
      </tr>)
    }
  }
  if(!flag){
    setSearchData(<tr>
      <td></td><td></td>
      <td>No results found for: <b>{searchInput}</b></td></tr>)
  }
}
///////////////////////////////////////////    HTML    /////////////////////////////////////////////////////
  return (
    <>
      <main className='flex'>
        <div className='main-content row'>
          <div className={responsiveDashboard} id='dashboard'>
            <div className='dashboard-header'>
              <div className='dashboard-header-buttons-left'>
                <p
                  className='dashboard-header-title'
                  id='dashboard-header-title'
                >
                  Company Template
                </p>
                <button className='publish-btn'>
                  <p className='publish-btn-p'>Publish</p>
                </button>
                <button className='star-btn'>
                  <i className='fa fa-star'></i>
                </button>
              </div>
              <div className='dashboard-header-buttons-right' id='dashboard-header-buttons-right'>
                <div className='dashboard-header-buttons-right-content'>
                  <button className='create-btn' onClick={() => {showTemplate(); setFormData({})}}>
                    CREATE COMPANY TEMPLATE
                  </button>
                  <i className='fa fa-edit'></i>
                  <i className='fa fa-calendar'></i>
                  <p>...</p>
                </div>
              </div>
            </div>
            <div className='dashboard-outer-content'>
              <div className='dashboard-outer-content-buttons'>
                  <div className='dashboard-outer-content-buttons-left col-6'>
                    <b style={{marginTop: '10px'}}>Filter: </b> <i className="fa fa-filter" style={{marginTop: '10px'}}></i>
                      <select className='dashboard-outer-content-filter-buttons' defaultValue={'Name'}>
                        <option value={'Name'} >Name</option>
                        <option>Shah</option>
                      </select>
                      <button className='dashboard-outer-content-filter-buttons'>
                        Classification  <i className="fa fa-arrow-down"></i>
                      </button>
                  </div>
                  <span className='dashboard-outer-content-buttons-right col-6'>

                    <button className='hidden-input' placeholder='Search by Code' ><b>Search by code:</b></button>

                    <input type="search" placeholder='Search' id='search-input'
                      onBlur={() => searchItem()}
                      value={searchInput}
                      onChange={e => setSearchInput(e.target.value)}
                    />
                    <button className='dashboard-outer-content-search-button'
                      onClick={() => {searchItem(true)}}>
                      Clear
                    </button>
                  </span>
              </div>
              <div className='dashboard-inner-content'>
                <div className='dashboard-inner-content-header'>
                  <div className='left-div'>Company Template</div>
                  <div className='right-div'>...</div>
                </div>
                <div className='chart-table'>
                  <table>
                    <thead className='table-head'>
                      <tr>
                        <th className='th-1'>
                          <button className='expand-btn'>Expand All</button>
                        </th>
                        <th className='th-id'>Id</th>
                        <th className='th-main'>Code</th>
                        <th className='th-main'>Name</th>
                        <th className='th-main'>Classification</th>
                        <th className='th-main'></th>
                      </tr>
                    </thead>
                    <tbody className={tableHide}>{GetAllCompanies()}</tbody>
                    <tbody>{searchData}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className={hide + ' company-template-form col-6'}>
            <div className='form-header'>
              Company Template
              <span>
                <button className='close-btn' onClick={hideTemplate}>
                  X
                </button>
              </span>
            </div>
            <form>
              <div className='form-upper-content'>
                <div className='form-left-side-bar'>General</div>
                <div className='form-right-side-bar'>
                  <div className='form-main-inputs row'>
                    <div className='col-5'>
                      <label>Name</label>
                      <input
                        type='text'
                        placeholder='Enter Name of Company'
                        required
                        id = 'name'
                        value={name ?? ''}
                        onBlur={e => onChange('name', e.target.value)}
                        onChange={e => setName(e.target.value)}
                      />
                    </div>
                    <div className='col-4'>
                      <label>Code</label>
                      <input
                        type='text'
                        placeholder='Enter code of Property'
                        required
                        id='code'
                        disabled={disable}
                        value={code ?? ''}
                        onBlur={e => onChange('code', e.target.value)}
                        onChange={e => setCode(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className='inputs-status'>
                    <label>Status</label>
                    <div className='status-btn'>
                      <div
                        className='draft-btn grey-bg'
                        onClick={() => changeStatus()}
                      >
                        Draft
                      </div>
                      <div
                        className='approved-btn transparent-bg'
                        onClick={() => changeStatus()}
                      >
                        Approved
                      </div>
                    </div>
                  </div>

                  <div className='input-description'>
                    <label>Description</label>
                    <div className='description-field'>
                      <textarea
                        className='description-area'
                        placeholder='Enter description'
                        value={description ?? ''}
                        id = 'description'
                        onBlur={e => onChange('description', e.target.value)}
                        onChange={e => setDescription(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className='input-classification'>
                    <label>Classification:</label>
                    <div className='select-box' id='select-box'>
                      <select
                        required
                        defaultValue='Select Classification'
                        onChange={e => onChange('classification', e.target.value)}
                      >
                        <option value='Select Classification' defaultChecked={true} disabled={true}>
                          Select Classification
                        </option>
                        <option value='Vendor' disabled={disable}>
                          Vendor
                        </option>
                        <option value='Manufacturer' disabled={disable}>
                          Manufacture
                        </option>
                        <option value='Customer' disabled={disable}>
                          Customer
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className='form-lower-content'>
                <div className='form-left-side-bar'>Properties</div>
                <div className='form-right-side-bar'>
                  <div className='props'>
                    <div className='props-header'>
                      Properties
                      <span className='props-span'>+</span>
                    </div>
                    <div className='props-body'>
                      No properties added yet.
                      <br />
                      To add click on "+" button.
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}
export default Company
