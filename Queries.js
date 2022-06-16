import {gql} from '@apollo/client';
// import { DeleteCompany } from '../components/company';

export const GET_USERS = gql`
query {
    companyTemplates(pageInfo:{pageSize: 5000, pageNo: 1}) {
        data {
          id
          code
          name
          classification
        }
      }
}`;


