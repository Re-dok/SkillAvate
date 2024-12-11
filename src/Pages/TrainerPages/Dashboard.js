import React, { Component } from "react";
import { Button, Table } from "reactstrap";
import { useState } from "react";
import { Carousel, CarouselItem, CarouselControl } from "reactstrap";
import { connect } from "react-redux";
import { downloadMultipleCollectionsAsExcel, getUsersByMonthAndYear } from "../../Firbase/firbaseUserDB";
// const mapDispatchToProps = {
//     doPasswordReset,
//     doSignOut,
//     doSetUserName,
// };
const mapStateToProps = (state) => {
    return {
        name: state.user.name,
        totalClients: state.user.myClients.length,
        totalTrainers: state.user.trainers.length,
        trainers: state.user.trainers,
    };
};
function ClientsPerMonthCard(props) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);
    const next = () => {
        if (animating) return;
        const nextIndex =
            activeIndex === props.usersBymonth.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    };
    const previous = () => {
        if (animating) return;
        const nextIndex =
            activeIndex === 0 ? props.usersBymonth.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    };
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const slides = props.usersBymonth.map((time, i) => {
        return (
            <CarouselItem
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
                key={i}
                className=" p-md-2 p-lg-5 p-0 py-3"
            >
                <div className="p-3 mx-5 my-4 py-4 rounded rounded-4 shadow-lg">
                    <p className="mb-0">
                        New Clients in {monthNames[time.month]}
                    </p>
                    <p className="mb-1">{time.year}</p>
                    <p className="mb-0">{time.count}</p>
                </div>
            </CarouselItem>
        );
    });

    return (
        <Carousel
            activeIndex={activeIndex}
            next={next}
            previous={previous}
            dark
            interval={false}
        >
            <CarouselControl
                direction="prev"
                directionText="Previous"
                onClickHandler={previous}
                className="carousal-icon-invert my-5 "
            />
            {slides}
            <CarouselControl
                direction="next"
                directionText="Next"
                onClickHandler={next}
                className="carousal-icon-invert my-5"
            />
        </Carousel>
    );
}
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trainers: [],
            totalClients: 0,
            totalTrainers: 0,
            usersBymonth: [],
            showModal: false,
            modalResp: false,
            modalMessage: "",
            isLoading: false,
        };
    }
    async componentDidMount() {
        const resp = await getUsersByMonthAndYear();
        this.setState({ usersBymonth: resp });
    }
    render() {
        const handleExport = async() => {
            await downloadMultipleCollectionsAsExcel();
        };
        const { usersBymonth } = this.state;
        const { totalClients, totalTrainers, trainers } = this.props;
        return (
            <div className="d-flex row gap-0 m-0 p-0 pt-3  mw-100 justify-content-center">
                <div className="row flex-row-reverse px-5 p-0 mb-0 mx-5 gap-4 justify-content-center justify-content-md-between align-content-center align-items-center ">
                    <Button className="col-5 col-lg-2" onClick={handleExport}>
                        Export
                    </Button>
                </div>
                <div className="row px-5 p-0 mb-0 mx-5 gap-4 align-content-center align-items-center ">
                    <div className=" col-lg-4 col-md-6 col-12">
                        <ClientsPerMonthCard
                            usersBymonth={usersBymonth || []}
                        />
                    </div>
                    <div className="d-none d-md-flex d-lg-none col-lg-3 col-md-3 col-12"></div>
                    <div className="col-lg-2 col-md-4 p-3 py-4 rounded rounded-4 shadow-lg">
                        <p>Total Number of Clients</p>
                        {totalClients || 0}
                    </div>
                    <div className="col-lg-2 col-md-4 p-3 py-4 rounded rounded-4 shadow-lg">
                        <p>Total Number of Trainers</p>
                        {totalTrainers || 0}
                    </div>
                </div>
                <div className="row px-5 mx-5 my-lg-1 my-4 gap-3">
                    <div className="fw-bold fs-5 p-0">Trainers Per Client</div>
                    <Table responsive striped className="shadow">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Email</th>
                                <th>Number of clients</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trainers.map((trainer, i) => (
                                <tr key={i}>
                                    <th scope="row">{i + 1}</th>
                                    <td>{trainer?.trainerEmail || "NA"}</td>
                                    <td>{trainer?.clients.length || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }
}
export default connect(mapStateToProps, null)(Dashboard);
