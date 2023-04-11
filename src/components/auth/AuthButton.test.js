import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from '../../test/server';
import AuthButtons from './AuthButtons';

async function renderComponent() {
  render(
    <MemoryRouter>
      <AuthButtons />
    </MemoryRouter>
  );
  await screen.findAllByRole('link');
}

describe('when user is not signed in', () => {
  createServer([
    {
      path: '/api/user',
      res: () => {
        return { user: null };
      },
    },
  ]);

  test('sign in and sign up are visible', async () => {
    await renderComponent();

    const signInBtn = screen.getByRole('link', { name: /Sign In/i });
    const signUpBtn = screen.getByRole('link', { name: /Sign Up/i });

    expect(signInBtn).toBeInTheDocument();
    expect(signInBtn).toHaveAttribute('href', '/signin');
    expect(signUpBtn).toBeInTheDocument();
    expect(signUpBtn).toHaveAttribute('href', '/signup');
  });
  test.only('sign out is not visible', async () => {
    await renderComponent();

    const signOutBtn = screen.queryByRole('link', { name: /Sign Out/i });

    expect(signOutBtn).not.toBeInTheDocument();
  });
});

describe.only('when user is signed in', () => {
  createServer([
    {
      path: '/api/user',
      res: () => {
        return { user: { id: 3, email: 'asdf@asdf.com' } };
      },
    },
  ]);

  test.only('sign in and sign up are not visible', async () => {
    await renderComponent();

    const signInBtn = screen.queryByRole('link', { name: /Sign In/i });
    const signUpBtn = screen.queryByRole('link', { name: /Sign Up/i });

    expect(signInBtn).not.toBeInTheDocument();
    expect(signUpBtn).not.toBeInTheDocument();
  });
  test('sign out is visible', async () => {
    renderComponent();

    const signOutBtn = screen.getByRole('link', { name: /Sign Out/i });

    expect(signOutBtn).toBeInTheDocument();
    expect(signOutBtn).toHaveAttribute('href', '/signout');
  });
});
