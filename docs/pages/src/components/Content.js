import { styled } from 'linaria/react';

const Content = styled.div`
  padding: 64px 24px 24px;
  width: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  @media (min-width: 640px) {
    padding: 64px;
  }

  @media (min-width: 960px) {
    padding: 86px;
  }
`;

export default Content;
