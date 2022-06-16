import {gql} from '@apollo/client'

export const ADD_COMPANY = gql`
mutation CREATECOMPANYTEMPLATE($classification: CompanyClassification!, $code: String!, $name: String!, $description: String){
    createCompanyTemplate(data:{classification: $classification, code: $code, name: $name, description: $description}){
      id
    }
}
`;


export const DELETE_COMPANY = gql`
mutation DELETECOMPANYTEMPLATE($id: [ID!]!){
    deleteCompanyTemplate(id: $id)
  }
`;

export const EDIT_COMPANY = gql`
mutation UPDATECOMPANYTEMPLATE($id: Int!, $description: String!, $name: String!){
    updateCompanyTemplate(data: {id: $id, name: $name, description: $description}) {
      id
      code
      name
      classification
    }
  }
`;

