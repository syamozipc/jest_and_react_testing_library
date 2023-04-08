import { render, screen } from '@testing-library/react';
import RepositoriesSummary from './RepositoriesSummary';

test('必要コンテンツが表示されているか', () => {
  const repository = {
    stargazers_count: 5,
    open_issues: 1,
    forks: 2,
    language: 'JavaScript',
  };

  render(<RepositoriesSummary repository={repository} />);

  for (const key in repository) {
    const value = repository[key];

    const element = screen.getByText(new RegExp(value));

    expect(element).toBeInTheDocument();
  }
});
