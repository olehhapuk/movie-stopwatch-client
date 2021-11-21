import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  Pagination,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { SearchRounded } from '@mui/icons-material';
import { DebounceInput } from 'react-debounce-input';

import axios from '../axios';
import ShowCard from './ShowCard';
import ShowsSkeleton from './ShowsSkeleton';
import AddShow from './AddShow';
import EditShow from './EditShow';

const PER_PAGE = 4;
const SORT_BY = 'updatedAt';
const SORT_ORDER = -1;
const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTlhMTU2MTJjMWM1ODc5YmFkNzM1MWUiLCJpYXQiOjE2Mzc0ODg5MTksImV4cCI6MTYzODA5MzcxOX0.tAAOVbwRcUMlwGkc2xSbPYwqgxIbYwTQ7LkkeC26FI8';

function App() {
  const [shows, setShows] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showsLoading, setShowsLoading] = useState(false);
  const [addShowVisible, setAddShowVisible] = useState(false);
  const [editShowId, setEditShowId] = useState(null);

  useEffect(fetchShows, [activePage, searchQuery]);

  function fetchShows() {
    setShowsLoading(true);

    axios({
      method: 'GET',
      url: '/shows',
      params: {
        search: searchQuery,
        page: activePage,
        perPage: PER_PAGE,
        sortBy: SORT_BY,
        sortOrder: SORT_ORDER,
      },
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    })
      .then((res) => {
        setShows(res.data.shows);
        setActivePage(res.data.activePage);
        setPageCount(res.data.pagesCount);
      })
      .finally(() => setShowsLoading(false));
  }

  function createShow(showData) {
    setAddShowVisible(false);
    axios({
      method: 'POST',
      url: '/shows',
      data: showData,
    })
      .then(fetchShows)
      .finally(() => setShowsLoading(false));
  }

  function editShow(showId, showData) {
    axios({
      method: 'PUT',
      url: `/shows/${showId}`,
      data: showData,
    }).then((res) => {
      setShows((prevShows) =>
        prevShows.map((show) => (show._id === res.data._id ? res.data : show))
      );
      setEditShowId(null);
    });
  }

  function editShowFavorite(showId, favorite) {
    axios({
      method: 'PATCH',
      url: `/shows/${showId}/favorite`,
      data: { favorite },
    }).then((res) =>
      setShows((prevShows) =>
        prevShows.map((show) => (show._id === res.data._id ? res.data : show))
      )
    );
  }

  function editShowStatus(showId, status) {
    axios({
      method: 'PATCH',
      url: `/shows/${showId}/status`,
      data: { status },
    }).then((res) =>
      setShows((prevShows) =>
        prevShows.map((show) => (show._id === res.data._id ? res.data : show))
      )
    );
  }

  function deleteShow(showId) {
    axios({
      method: 'DELETE',
      url: `/shows/${showId}`,
    }).then(fetchShows);
  }

  return (
    <Container>
      <AddShow
        open={addShowVisible}
        onClose={() => setAddShowVisible(false)}
        onSubmit={createShow}
      />
      <EditShow
        open={!!editShowId}
        onClose={() => setEditShowId(null)}
        onSubmit={editShow}
        showId={editShowId}
      />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '24px 0',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <DebounceInput
            element={TextField}
            debounceTimeout={250}
            type="text"
            autoComplete="off"
            placeholder="Type to search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchRounded />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Button variant="outlined" onClick={() => setAddShowVisible(true)}>
          Add Show
        </Button>
      </Box>

      {showsLoading && (
        <ShowsSkeleton count={shows.length === 0 ? PER_PAGE : shows.length} />
      )}

      {shows.length > 0 && !showsLoading && (
        <Grid container spacing={1}>
          {shows.map((show) => (
            <Grid key={show._id} item xs={12} xl={2} lg={3} md={4} sm={6}>
              <ShowCard
                {...show}
                onChangeFavorite={editShowFavorite}
                onChangeStatus={editShowStatus}
                onDelete={deleteShow}
                onEdit={setEditShowId}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {shows.length === 0 && !showsLoading && (
        <Alert severity="info">No shows found</Alert>
      )}

      {pageCount > 0 && (
        <Pagination
          sx={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}
          count={pageCount}
          page={activePage}
          onChange={(e, value) => setActivePage(value)}
        />
      )}
    </Container>
  );
}

export default App;
