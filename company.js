import React, { useEffect, useState } from 'react'
import { useMutation, useLazyQuery } from '@apollo/client'
import { GET_USERS } from '../GraphQL/Queries'
import { ADD_COMPANY, DELETE_COMPANY, EDIT_COMPANY } from '../GraphQL/Mutations'
import { changeStatus } from '../Functions/functions'

function Company () {
  let temp = document.getElementById('main-section-span')
  if (temp) temp.innerHTML = null

  const [formData, setFormData] = useState({})
  const [th, setTh] = useState('th-main')
  const [searchData, setSearchData] = useState('')
  const [searchHide, setSearchHide] = useState('')
  const [span, setSpan] = useState('search-span span-margin')
  const [flex, setFlex] = useState('flex-row')
  const [hide, setHide] = useState('company-template-form hide')
  const [width, setWidth] = useState('dashboard-header vw87')
  const [publish, setPublish] = useState('publish-btn')
  const [star, setStar] = useState('star-btn')
  const [disable, setDisable] = useState('')
  const [rightBtn, setRightBtn] = useState('dashboard-header-buttons-right')
  const [editCompanyId, setEditCompanyId] = useState(null)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')

////////////////////////////////  fill data from INPUTS into formData object  ////////////////////////////////
  const onChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value
    })
  }
////////////////////////// async function working on useEffect whenever a formData changes   ////////////////
  const sendRequests = async() => {
    if (
      formData.name === '' ||
      formData.code === '' ||
      formData.classification === "Select Classification" ||
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
        if(errorAdding)
            console.log(errorAdding);
        setInputsToNull()
        setFormData({});

    } else {
        const toBeSendFormData = JSON.parse(JSON.stringify(formData))
        delete toBeSendFormData?.code;
            await editCompanyTemplate({
            variables: {          
                id: editCompanyId,
            ...toBeSendFormData
            }
        })
        if(errorEditing)
            console.log(errorEditing);
    }
    getCompanies()
  }

  useEffect(()=>{
    sendRequests()
  }, [formData])

///////////////////////////////////  hide create company template form  ////////////////////////////////////
  const hideTemplate = () => {
    setFlex('flex-row')
    setSpan('search-span span-margin')
    setHide('company-template-form hide')
    setTh('th-main')
    setWidth('dashboard-header vw87')
    setPublish('publish-btn')
    setStar('star-btn')
    setRightBtn('dashboard-header-buttons-right')
    document.getElementById(
        'dashboard-header-title'
        ).innerHTML = `Company Template`
    document.getElementById('dashboard').style.width = '100%'
    setInputsToNull()
    setFormData({})
    setEditCompanyId(null)
  }

/////////////////////////////////////  show create company template   //////////////////////////////////////
  const showTemplate = () => {
    if(!editCompanyId === null)
        fillAll_Inputs();
    else{
        setInputsToNull();
        formData.name = '';
        formData.code = '';
    }
    setEditCompanyId(null)
    setFlex('flex-column')
    setSpan('search-span')
    setDisable(false)
    setHide('company-template-form')
    setTh('th-main-after')
    setWidth('dashboard-header')
    setPublish('publish-btn-after')
    setStar('star-btn-after')
    setRightBtn('dashboard-header-buttons-right-after')
    document.getElementById(
      'dashboard-header-title'
    ).innerHTML = `Company <br>Template`
    document.getElementById('dashboard').style.width = '50%'
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const setInputsToNull = () => {
    setCode('')
    setName('')
    setDescription('')
  }
  const fillAll_Inputs = () => {
    setCode(formData.code)
    setName(formData.name)
    setDescription(formData.description)
  }
  ////////////////////////////////  Fill the table from the fetched data   ///////////////////////////////////
  function getAllCompanies (td) {
    if (isLoading) return 
        <tr>
            <td>Loading data...</td>
        </tr>
    if (errorFetching) return 
        <tr>
            <td>Error: {errorFetching}</td>
        </tr>
    return data?.companyTemplates?.data?.map(
      ({ id, code, name, classification }) => (
        <tr key={id} id={id}>
          <td className='td-1'>
            <i className='fa fa-building' />
          </td>
          <td className='td-id'>{id}</td>
          <td className={td}>{code}</td>
          <td className={td}>{name}</td>
          <td className={td}>{classification}</td>
          <td className={td + '-last'}>
            <button className='fa fa-trash' onClick={() => DeleteCompany(id)} />
            <button
              className='fa fa-pencil'
              onClick={() => EditCompany({ id, code, name, classification })}
            />
          </td>
        </tr>
      )
    )
  }

  /////////////////////////////  Query for Getting Company Data   ////////////////////////////////////////////
  const [getCompanies,{ loading: isLoading, error: errorFetching, data }] = useLazyQuery(GET_USERS, {
    fetchPolicy: 'network-only', // Used for first execution
    nextFetchPolicy: 'cache-first' // Used for subsequent executions
  })
  useEffect(() => {
    getCompanies()
  }, [])

  ////////////////////////////  Mutation for adding new Company   ////////////////////////////////////////////
  const [createCompanyTemplate, { error: errorAdding }] = useMutation(
    ADD_COMPANY
  )


  ///////////////////////////  Mutation for deleting an existing Company  ////////////////////////////////////
  const [deleteCompanyTemplate, { error: deletingError }] = useMutation(
    DELETE_COMPANY
  )

  function DeleteCompany (_id) {
    deleteCompanyTemplate({
      variables: {
        id: _id
      }
    })
    if (deletingError) console.log('errorDeleting', deletingError)
    else console.log('Deleted Successfully')

    setEditCompanyId(null)
    getCompanies();
    getCompanies();
  }

////////////////////////////   Mutation for editing an existing Company  ///////////////////////////////////
  const [editCompanyTemplate, { error: errorEditing }] = useMutation(
    EDIT_COMPANY
  )

  function EditCompany ({ id, code, name, classification }) {
    showTemplate()
    formData.name = name
    formData.code = code
    formData.classification = classification
    formData.description = 'Click to add description'
    fillAll_Inputs();
    setEditCompanyId(id)
    setDisable(true)

    if (errorEditing) {
      console.log('errorUpdating a company', errorEditing)
    }
  }




////////////////////////////////////////    Search By Code   ///////////////////////////////////////////////
  const searchItem = () =>{
    let key = document.getElementById('search-input').value
    if(key === '')
      return;
    console.log("Hello2", key)
    setSearchHide('hide');
    for(let i=0; i<data.companyTemplates.data.length; i++){
      if(key === data.companyTemplates.data[i].code){  
        console.log(data.companyTemplates.data[i]);
        setSearchData(<tr>
          <td className='td-1'>
            <i className='fa fa-building' />
          </td>
          <td className='td-id'>{data.companyTemplates.data[i].id}</td>
          <td >{data.companyTemplates.data[i].code}</td>
          <td >{data.companyTemplates.data[i].name}</td>
          <td >{data.companyTemplates.data[i].classification}</td>
        </tr>)
      }
    }
    

  }
///////////////////////////////////////////    HTML    /////////////////////////////////////////////////////
  return (
    <>
      <main className='flex'>
        <div className='main-content'>
          <div className='dashboard' id='dashboard'>
            <div className={width}>

              <div className='dashboard-header-buttons-left'>
                <p
                  className='dashboard-header-title'
                  id='dashboard-header-title'
                >
                  Company Template
                </p>
                <button className={publish}>Publish</button>
                <button className={star}>
                  <i className='fa fa-star'></i>
                </button>
              </div>
              <div className={rightBtn} id='dashboard-header-buttons-right'>
                <button className='create-btn' onClick={() => {showTemplate(); setFormData({})}}>
                  CREATE COMPANY TEMPLATE
                </button>
                <i className='fa fa-edit'></i>
                <i className='fa fa-calendar'></i>
                <p>...</p>
              </div>
            </div>
            <div className='dashboard-outer-content'>
              <div className='dashboard-outer-content-buttons'>

              <div className={flex}>
              <div className='flex-row'>
              <b style={{marginTop: '10px'}}>Filter: </b> <i className="fa fa-filter" style={{marginTop: '10px'}}></i>
                <button className='dashboard-outer-content-filter-buttons'>
                Name <i className="fa fa-arrow-down"></i></button>
                <button className='dashboard-outer-content-filter-buttons'>
                Classification  <i className="fa fa-arrow-down"></i></button>
                </div>
                <span className={span}>
                  <input type="search" placeholder='Search by Code' id='search-input'/>
                  <button className='dashboard-outer-content-search-button'
                  onClick={() => searchItem()}>
                Search</button>
                </span>
              </div>
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
                        <th className={th}>Code</th>
                        <th className={th}>Name</th>
                        <th className={th}>Classification</th>
                        <th className={th}></th>
                      </tr>
                    </thead>
                    <tbody className={searchHide}>{getAllCompanies()}</tbody>
                    <tbody>{searchData}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className={hide}>
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
                  <div className='form-main-inputs'>
                    <div className='col-6'>
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
                    <div className='col-6'>
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
                        onChange={e =>
                          onChange('classification', e.target.value)
                        }
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