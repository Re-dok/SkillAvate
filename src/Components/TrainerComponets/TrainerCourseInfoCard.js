import React, { Component } from "react";

export default class TrainerCourseInfoCard extends Component {
    render() {
        const {
            courseDiscp,
            courseName,
            courseId,
            isPublished,
            createrEmail,
            createrName,
        } = this.props;
        return (
            <div>
                <div className="col-lg-9 col bg-grey py-5 px-lg-5">
                    {courseName}
                    {courseId}
                    {createrName}
                    {createrEmail}
                    {isPublished}
                    {courseDiscp}
                </div>
            </div>
        );
    }
}
