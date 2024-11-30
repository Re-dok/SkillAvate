import React, { Component } from "react";
import { Button, Table } from "reactstrap";
import withRouter from "../../Components/WithRouter";
import { connect } from "react-redux";
// TODO finish this page
const mapStateToprops = (state) => {
    return {
        isLoading: state.user.loading,
        error: state.user.error,
        success: state.user.success,
        myClients: state.user.myClients,
    };
};
class MyClients extends Component {
    render() {
        const myClients = this.props.myClients;
        console.log(this.props.courses);
        return (
            <div className="px-2 px-md-5 mx-2 mx-md-5 mt-5">
                <Table striped>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Client Email</th>
                            <th>Courses Id</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myClients.map((client, i) => (
                            <tr>
                                <th
                                    scope="row "
                                    className="align-content-center"
                                >
                                    {i + 1}
                                </th>
                                <td className="align-content-center">
                                    {client.clientEmail}
                                </td>
                                <td className="px-3">
                                    {client.courses.map((course) => (
                                        <>
                                            <div className="border-bottom border-2 py-2 d-flex justify-content-between align-items-center">
                                                <p className="mb-0 me-3">
                                                    {course}
                                                </p>
                                                <Button
                                                    size="sm"
                                                    color="danger"
                                                >
                                                    <i class="bi bi-dash-circle-dotted me-2"></i>
                                                    Remove Course
                                                </Button>
                                            </div>
                                        </>
                                    ))}
                                    <div className="justify-content-end d-flex py-2">
                                        <Button size="sm" color="success">
                                            <i class="bi bi-plus-circle-dotted me-2"></i>
                                            Add Course
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        );
    }
}
export default connect(mapStateToprops, null)(withRouter(MyClients));
