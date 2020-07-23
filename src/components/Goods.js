import React from 'react'
import { fetchGoods, deleteGood } from '../store/actions/goodActions.js'
import { GenericPage, Link } from "./shared";

const TYPE = 'goods';

const formatProvider = ({provider}) => {
  return provider.type === 'Organization' ? provider.company
    : (provider.profile ? `${provider.profile.first_name} ${provider.profile.last_name}` : 'Not provided')
};

// mui-table column configurations
// TODO: Add custom print function for address
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
        return <Link color to={`/${TYPE}/${rowData[0]}`}>{data}</Link>
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

export default function Goods() {

  const nameFormatter = good => good.name;

  const generateMarkers = (goods, pageNumber, rowsPerPage) => {
    // TODO: verify this works as expected
    goods.slice((pageNumber - 1) * rowsPerPage, pageNumber * rowsPerPage)
      .map(good => ({
        position: {lat: Number(good.location.lat), lng: Number(good.location.lng)},
        title: nameFormatter(good),
        link: `/${TYPE}/${good.id}`,
        content: good.desc,
      })).filter(client => client.position.lat && client.position.lng);
  };

  return (
    <GenericPage
      type={TYPE}
      columnsWithoutOptions={columnsWithoutOptions}
      fetchData={fetchGoods}
      deleteItem={deleteGood}
      generateMarkers={generateMarkers}
      nameFormatter={nameFormatter}
    />
  )
}
