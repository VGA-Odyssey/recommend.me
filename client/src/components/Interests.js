import React, { Component } from 'react'
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import axios from 'axios';
import './css/interests.css';

export class Interests extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: '',
            skills: [],
            btnClick: false,
        };
    }

    componentDidMount() {
        axios.get('http://localhost:4000/api/clubs/')
        .then(res => {
            const clubs = res.data;
            console.log(clubs);
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
                    <Toast onClose={() => {this.onClose(skill)}}>
                        <Toast.Header>
                            <strong className="mr-auto">Interest</strong>
                        </Toast.Header>
                        <Toast.Body>
                            {skill}
                        </Toast.Body>
                    </Toast>
                ))}

                <Button variant={'secondary'} size={'lg'} className={'recom'} style={this.buttonHide()} block>See Recommendations</Button>

            </Container>
        )
    }
}

export default Interests
