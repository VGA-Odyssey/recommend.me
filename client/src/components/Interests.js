import React, { Component } from 'react'
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import Card from 'react-bootstrap/Card';
import CardColumns from 'react-bootstrap/CardColumns';
import axios from 'axios';
import './css/interests.css';
const uuid = require('uuid');

export class Interests extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: '',
            skills: [],
            btnClick: false,
            club: {},
            clubData: [],
        };
    }

    componentDidMount() {
        axios.get('http://localhost:4000/api/clubs/')
        .then(res => {
            const clubs = res.data;
            const elem = clubs[Number.parseInt(Math.random() * clubs.length)];
            this.setState({club: elem});
        })
    }

    onClick = (e) => {
        if(this.state.value !== ''){
         this.setState({skills: [...this.state.skills, this.state.value]},
                this.setState({value: '', btnClick: true})
            )
         }
    }

    onChange = (e) => {
        this.setState({value: e.target.value});
    }

    onClose = (skill) => {
        console.log(skill)
        this.setState({skills: this.state.skills.filter(oneSkill => oneSkill !== skill)});
    }
    
    buttonHide = () => {
        return {
            display: !this.state.btnClick ? 'none' : 'block',
        }
    }

    prediction = () => {
        axios.get(`http://localhost:4000/api/predict/${this.state.club.id}`)
        .then(res => {
            const prediction = res.data;
            prediction.recomms.map(predictions => {
                axios.get(`http://localhost:4000/api/clubs/${predictions.id}`)
                .then(resp => {
                    this.setState({clubData: [...this.state.clubData, resp.data]});

                    axios.get('http://localhost:4000/api/clubs/')
                    .then(res => {
                        const clubs = res.data;
                        const elem = clubs[Number.parseInt(Math.random() * clubs.length)];
                        this.setState({club: elem});
                    })
                })
            })
        })
    }


    render() {
        return (
            <Container>
                <div className={'welcome-text'}>
                    <h1>
                        Find Your Perfect Club Today
                    </h1>
                    <h2>
                        Enter your interests
                    </h2>
                </div>

                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Enter an Interest</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl value={this.state.value} onChange={(e) => {this.onChange(e)}} className={'input'}/>
                    <InputGroup.Prepend>
                        <Button variant={'outline-secondary'} onClick={(e) => {this.onClick(e)}}>Add Element</Button>
                    </InputGroup.Prepend>
                </InputGroup>
                
                {this.state.skills.map(skill => (
                    <Toast key={uuid.v4()} onClose={() => {this.onClose(skill)}}>
                        <Toast.Header>
                            <strong className="mr-auto">Interest</strong>
                        </Toast.Header>
                        <Toast.Body>
                            {skill}
                        </Toast.Body>
                    </Toast>
                ))}

                <Button variant={'secondary'} size={'lg'} className={'recom'} style={this.buttonHide()} onClick={() => {this.prediction()}} block>See Recommendations</Button>
                
                <CardColumns>
                    {this.state.clubData.map(club => (
                        <Card key={uuid.v4()} style={{width: '15em'}}>
                            <Card.Img variant={'top'} src={club.img} />
                            <Card.Body>
                                <Card.Title>{club.title}</Card.Title>
                                <Card.Text>{club.desc || 'No Description Available'}</Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <a href={club.url}>
                                    <Button variant={'outline-secondary'}>
                                        Website
                                    </Button>
                                </a>
                            </Card.Footer>
                        </Card>
                    ))}
                </CardColumns>

            </Container>
        )
    }
}

export default Interests
