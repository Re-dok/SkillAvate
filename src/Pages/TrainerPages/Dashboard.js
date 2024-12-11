import React, { Component } from "react";
import { Table } from "reactstrap";
import { useState } from "react";
import { Carousel, CarouselItem, CarouselControl } from "reactstrap";

const items = [
    {
        src: "https://picsum.photos/id/123/1200/400",
        altText: "Slide 1",
        caption: "Slide 1",
        key: 1,
    },
    {
        src: "https://picsum.photos/id/456/1200/400",
        altText: "Slide 2",
        caption: "Slide 2",
        key: 2,
    },
    {
        src: "https://picsum.photos/id/678/1200/400",
        altText: "Slide 3",
        caption: "Slide 3",
        key: 3,
    },
];

function ClientsPerMonthCard(args) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    const next = () => {
        if (animating) return;
        const nextIndex =
            activeIndex === items.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    };

    const previous = () => {
        if (animating) return;
        const nextIndex =
            activeIndex === 0 ? items.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    };

    const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
    };

    const slides = items.map((item) => {
        return (
            <CarouselItem
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
                key={item.src}
                className=" p-md-5 p-0 py-3"
            >
                <div className="p-3 mx-5 my-4 py-4 rounded rounded-4 shadow-lg">
                    <p>New Clients in Jan 2021</p>
                    <p className="mb-0">0</p>
                </div>
            </CarouselItem>
        );
    });

    return (
        <Carousel
            activeIndex={activeIndex}
            next={next}
            previous={previous}
            {...args}
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
export default class Dashboard extends Component {
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
    //     componentDidMount() {
    //   const resp = getDashBoardInfo();
    //         this.setState({
    //             trainers: resp.trainers,
    //             totalClients: resp.totalClients,
    //             usersBymonth: resp.usersBymonth,
    //         });
    //     }
    render() {
        const { totalClients, totalTrainers } = this.state;
        return (
            <div className="d-flex row gap-0 m-0 p-0  mw-100 justify-content-center">
                <div className="row px-5 p-0 mb-0 mx-5 mt-3 gap-4 align-content-center align-items-center ">
                    <div className=" col-lg-4 col-md-6 col-12">
                        <ClientsPerMonthCard />
                    </div>
                    <div className="d-none d-md-flex col-lg-3 col-md-3 col-12"></div>
                    <div className="col-lg-2 col-md-4 p-3 py-4 rounded rounded-4 shadow-lg">
                        <p>Total Number of Clients</p>
                        {totalClients}
                    </div>
                    <div className="col-lg-2 col-md-4 p-3 py-4 rounded rounded-4 shadow-lg">
                        <p>Total Number of Trainers</p>
                        {totalTrainers}
                    </div>
                </div>
                <div className="row px-5 mx-5 my-lg-1 my-4 gap-3">
                    <div className="fw-bold fs-5 p-0">Trainers Per Client</div>
                    <Table responsive striped className="shadow-lg">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Number of cliets</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td>Larry</td>
                                <td>the Bird</td>
                                <td>@twitter</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }
}
