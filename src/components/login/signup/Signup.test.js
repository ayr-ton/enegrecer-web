import React from 'react';
import Signup from './Signup';
import { shallow } from 'enzyme';
import * as firebase from '../../../utils/firebaseUtils';

jest.mock('../../../utils/firebaseUtils');

describe('Signup component', () => {
    it('renders without crashing', () => {
        const wrapper = shallow(<Signup />);
        expect(wrapper.exists()).toBe(true);
    });

    it('initializes the state properly', () => {
        const wrapper = shallow(<Signup />);
        const expectedState = {
            logged: false,
            login: "",
            password: "",
            firstName: "",
            lastName: ""
        };
        expect(wrapper.state()).toEqual(expectedState);
    });

    describe('setProperty method', () => {
        it('set a property in the state', () => {
            const wrapper = shallow(<Signup />);
            const simulatedEvent = {
                target: {
                    value: true
                }
            };
            const propertyToSet = 'logged';
            wrapper.instance().setProperty(simulatedEvent, propertyToSet);
            expect(wrapper.state(propertyToSet)).toBe(simulatedEvent.target.value);
        });

        it('does not override other properties of the state', () => {
            const wrapper = shallow(<Signup />);
            const propertyToSet = 'logged';
            const simulatedEvent = {
                target: {
                    value: true
                }
            };

            let expetctedState = wrapper.state();
            expetctedState[propertyToSet] = simulatedEvent.target.value;

            wrapper.instance().setProperty(simulatedEvent, propertyToSet);
            expect(wrapper.state()).toEqual(expetctedState);
        });
    });

    describe('onPressRegisterButton method', () => {
        beforeEach(() => {
            firebase.userObj.sendEmailVerification.mockClear();
        });

        it('sets the state with "logged" to true when registration is sucessfull', async () => {
            const wrapper = shallow(<Signup />);
            wrapper.setState({
                login: 'pass',
                password: 'any'
            });
            await wrapper.instance().onPressRegisterButton();
            expect(wrapper.state('logged')).toBe(true);
        });

        it('sets the state with the error variables when the login fails', async () => {
            const wrapper = shallow(<Signup />);
            wrapper.setState({
                login: 'error',
                password: 'weak'
            });
            await wrapper.instance().onPressRegisterButton();
            expect(wrapper.state('loginErrorMessage')).toEqual('Senha deve ter no mínimo 6 caracteres');
            expect(wrapper.state('loginError')).toEqual('auth/weak-password');
            expect(wrapper.state('logged')).toBe(false);
            expect(wrapper.state('password')).toEqual('');
        });

        it('should call the "sendEmailVerification" method when creating a user', async () => {
            const wrapper = shallow(<Signup />);
            wrapper.setState({
                login: 'pass',
                password: 'any'
            });
            await wrapper.instance().onPressRegisterButton();
            expect(firebase.userObj.sendEmailVerification.mock.calls.length).toBe(1);
        });
    });
});