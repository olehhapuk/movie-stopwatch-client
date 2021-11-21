import { Grid, Skeleton } from '@mui/material';

function ShowsSkeleton({ count }) {
  return (
    <Grid container spacing={1}>
      {new Array(count).fill(undefined).map((_, index) => (
        <Grid key={index} item xs={12} xl={2} lg={3} md={4} sm={6}>
          <Skeleton variant="rectangular" width="100%" height="250px" />
          <Skeleton variant="text" width="90%" height="41px" />
          <Skeleton variant="text" width="45px" height="19px" />
          <Skeleton variant="text" width="60px" height="19px" />
          <Skeleton variant="text" width="60px" height="19px" />
          <Skeleton
            variant="text"
            width="90px"
            height="19px"
            sx={{ marginBottom: '12px' }}
          />
          <Skeleton variant="rectangular" width="120px" height="56px" />
        </Grid>
      ))}
    </Grid>
  );
}

export default ShowsSkeleton;
