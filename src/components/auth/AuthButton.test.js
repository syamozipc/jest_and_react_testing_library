import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from '../../test/server';
import AuthButtons from './AuthButtons';
import { SWRConfig } from 'swr';

async function renderComponent() {
  render(
    // SWRのキャッシュが効いてしまいテストが正常に動作しない問題を避けるためにSWRConfigで囲う必要がある
    // https://swr.vercel.app/ja/docs/advanced/cache#%E3%83%86%E3%82%B9%E3%83%88%E3%82%B1%E3%83%BC%E3%82%B9%E9%96%93%E3%81%AE%E3%82%AD%E3%83%A3%E3%83%83%E3%82%B7%E3%83%A5%E3%81%AE%E3%83%AA%E3%82%BB%E3%83%83%E3%83%88
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter>
        <AuthButtons />
      </MemoryRouter>
    </SWRConfig>
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
    // debugger;
    await renderComponent();

    const signInBtn = screen.getByRole('link', { name: /Sign In/i });
    const signUpBtn = screen.getByRole('link', { name: /Sign Up/i });

    expect(signInBtn).toBeInTheDocument();
    expect(signInBtn).toHaveAttribute('href', '/signin');
    expect(signUpBtn).toBeInTheDocument();
    expect(signUpBtn).toHaveAttribute('href', '/signup');
  });
  test('sign out is not visible', async () => {
    await renderComponent();

    const signOutBtn = screen.queryByRole('link', { name: /Sign Out/i });

    expect(signOutBtn).not.toBeInTheDocument();
  });
});

describe('when user is signed in', () => {
  createServer([
    {
      path: '/api/user',
      res: () => {
        return { user: { id: 3, email: 'asdf@asdf.com' } };
      },
    },
  ]);

  test('sign in and sign up are not visible', async () => {
    // debugger;
    await renderComponent();

    const signInBtn = screen.queryByRole('link', { name: /Sign In/i });
    const signUpBtn = screen.queryByRole('link', { name: /Sign Up/i });

    expect(signInBtn).not.toBeInTheDocument();
    expect(signUpBtn).not.toBeInTheDocument();
  });
  test('sign out is visible', async () => {
    await renderComponent();

    const signOutBtn = screen.getByRole('link', { name: /Sign Out/i });

    expect(signOutBtn).toBeInTheDocument();
    expect(signOutBtn).toHaveAttribute('href', '/signout');
  });
});
