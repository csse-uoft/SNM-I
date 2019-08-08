import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Glyphicon, Dropdown, MenuItem } from 'react-bootstrap'
import DropdownMenu from '../shared/DropdownMenu'


class ServiceRow extends Component {

  render() {
    const service = this.props.service;

    return(
      <tr>
        <td>
          <Link to={`/service/${service.id}`}>
            {service.name}
          </Link>
        </td>
        {service.provider.type === "Organization" &&
          <td className="centered-text">
            <Link to={`/provider/${service.provider.id}`}>
              {service.provider.company}
            </Link>
          </td>
        }

        {service.provider.type === "Individual" &&
          <td className="centered-text">
            <Link to={`/provider/${service.provider.id}`}>
              {`${service.provider.profile.first_name} ${service.provider.profile.last_name}`}
            </Link>
          </td>
        }

        <td>
          {service.desc}
        </td>

        <td>
          {service.category}
        </td>
        <td>
          <DropdownMenu
            urlPrefix="service"
            objectId={service.id}
            handleShow={this.props.handleShow}
          />
        </td>
      </tr>
    )
  }
}


// const mapStateToProps = (state) => {
//   return {
//     currentUser: state.auth.currentUser
//   }
// }

export default ServiceRow;
