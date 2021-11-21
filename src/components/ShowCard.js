import {
  Box,
  Card,
  IconButton,
  Typography,
  Link,
  Select,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  StarRounded,
  StarOutlineRounded,
  MoreHorizRounded,
} from '@mui/icons-material';
import { useState } from 'react';

const notFoundUrl =
  'https://hostiq.ua/wiki/wp-content/uploads/2021/05/03-error-404-not-found.png';

function ShowCard({
  _id,
  title,
  imageUrl,
  siteUrl,
  season,
  episode,
  timecode,
  status,
  favorite,
  onChangeStatus,
  onChangeFavorite,
  onDelete,
  onEdit,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = !!anchorEl;

  function openMenu(e) {
    setAnchorEl(e.currentTarget);
  }

  function closeMenu() {
    setAnchorEl(null);
  }

  return (
    <Card variant="outlined" sx={{ overflow: 'hidden', position: 'relative' }}>
      <Box
        component="img"
        src={imageUrl || notFoundUrl}
        alt={title}
        sx={{
          width: '100%',
          minHeight: '250px',
          height: '250px',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <IconButton onClick={() => onChangeFavorite(_id, !favorite)}>
          {favorite ? (
            <StarRounded color="warning" fontSize="large" />
          ) : (
            <StarOutlineRounded color="warning" fontSize="large" />
          )}
        </IconButton>
        <IconButton onClick={openMenu}>
          <MoreHorizRounded />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={closeMenu}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem
            onClick={() => {
              onEdit(_id);
              closeMenu();
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              onDelete(_id);
              closeMenu();
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      </Box>

      <Box sx={{ padding: '6px 12px 12px' }}>
        <Typography variant="h5">{title}</Typography>
        <Link
          href={siteUrl}
          target="_blank"
          rel="noreferrer"
          sx={{ fontFamily: 'Roboto' }}
        >
          Watch
        </Link>
        <Typography variant="subtitle1">
          Season: {season}
          <br />
          Episode: {episode}
          <br />
          Timecode: {timecode}
        </Typography>
        <Select
          value={status}
          onChange={(e) => onChangeStatus(_id, e.target.value)}
        >
          <MenuItem value="TO_WATCH">To Watch</MenuItem>
          <MenuItem value="WATCHING">Watching</MenuItem>
          <MenuItem value="FINISHED">Finished</MenuItem>
        </Select>
      </Box>
    </Card>
  );
}

export default ShowCard;
