import { AddHotel } from '@/components/AddHotel';
import { HotelsTable } from '@/components/HotelsTable';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Button, IconButton, Toolbar } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function Home() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              Hotel Ranking
            </Typography>
          </Toolbar>
        </AppBar>

        <Box display={"flex"} p={2}>
          <Typography variant='h6' component={'p'}>
            Manage Hotels
          </Typography>

          <Box display={"flex"} sx={{ ml: 'auto', gap: 2 }}>
            <AddHotel />
            <Button color='secondary' variant='text' size='small' sx={{ alignSelf: "end", textDecoration: "underline" }}>Manage Hotel Category</Button>
          </Box>
        </Box>
      </Box>
      <HotelsTable />
    </Container>
  );
}
