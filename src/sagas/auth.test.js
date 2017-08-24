import rootSaga, { handleRequestSignIn, signIn } from './auth';
import { fork, call, put, take } from 'redux-saga/effects';
import { REQUEST_SIGN_IN, successSignIn, failureSignIn } from '../actions';

jest.mock('../utils/firebaseUtils');

describe('Auth Sagas', () => {
    describe('Sign in', () => {
        let saga;
        let mockRequestSignInAction = {
            type: REQUEST_SIGN_IN,
            payload: {}
        };

        beforeEach(() => {
            saga = handleRequestSignIn();
        });

        it('should login with success', () => {
            mockRequestSignInAction.payload = {
                email: "pass",
                password: "any"
            };

            expect(saga.next().value).toEqual(take(REQUEST_SIGN_IN));
            expect(saga.next(mockRequestSignInAction).value).toEqual(call(signIn, mockRequestSignInAction));
            expect(saga.next({ user: 'any' }).value).toEqual(put(successSignIn({ user: 'any' })))
        });

        it('should faill login', () => {
            mockRequestSignInAction.payload = {
                email: "error",
                password: "userNotFound"
            };

            expect(saga.next().value).toEqual(take(REQUEST_SIGN_IN));
            expect(saga.next(mockRequestSignInAction).value).toEqual(call(signIn, mockRequestSignInAction));
            expect(saga.next({ error: 'any' }).value).toEqual(put(failureSignIn({ error: 'any' })))
        });
    });

    describe('Root Sagas', () => {
        it('should contain handleRequestSignIn', () => {
            const saga = rootSaga();

            expect(saga.next().value).toEqual(fork(handleRequestSignIn));
            expect(saga.next().done).toBe(true);
        });
    });
});
