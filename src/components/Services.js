import React from 'react'
import { Link } from './shared';
import { fetchServices, deleteService } from '../store/actions/serviceActions.js'
import { GenericPage } from "./shared";

const TYPE = 'services';

const formatProvider = ({provider}) => {
  return provider.type === 'Organization' ? provider.company
    : (provider.profile ? `${provider.profile.first_name} ${provider.profile.last_name}` : 'Not provided')
};

const columnsWithoutOptions = [
  {
    name: 'id',
    options: {
      sort: false,
      viewColumns: false,
      display: 'excluded',
      searchable: false,
      filter: false,
    }
  },
  {
    name: 'name',
    label: 'Name',
    options: {
      sort: true,
      customBodyRender: (data, {rowData}) => {
        return <Link color to={`/${TYPE}/` + rowData[0]}>{data}</Link>
      }
    }
  },
  {
    name: 'provider',
    label: 'Provider',
    options: {
      sort: true,
      customBodyRender: provider => {
        return (
          <Link color to={`/${TYPE}/${provider.id}`}>
            {formatProvider({provider})}
          </Link>
        );
      }
    }
  },
  {
    name: 'desc',
    label: 'Description',
  },
  {
    name: 'category',
    label: 'Category'
  }
];

export default function Services() {

  const nameFormatter = service => service.name;

  const generateMarkers = (data, pageNumber, rowsPerPage) => {
    // TODO: verify this works as expected
    const currPageServices = data.slice((pageNumber - 1) * rowsPerPage, pageNumber * rowsPerPage);
    return currPageServices.map(service => ({
      position: {lat: Number(service.location.lat), lng: Number(service.location.lng)},
      title: service.name,
      link: `/${TYPE}/${service.id}`,
      content: service.desc,
    })).filter(service => service.position.lat && service.position.lng);
  };

  return (
    <GenericPage
      type={TYPE}
      columnsWithoutOptions={columnsWithoutOptions}
      fetchData={fetchServices}
      deleteItem={deleteService}
      generateMarkers={generateMarkers}
      nameFormatter={nameFormatter}
    />
  )
}
