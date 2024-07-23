import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Note from './components/Note';
import NewNote from './components/NewNote';


export default function App() {
  return (
    <CssVarsProvider>
      <Sheet
        sx={{
          width: 900,
          mx: 'auto', // margin left & right
          my: 4, // margin top & bottom
          py: 3, // padding top & bottom
          px: 2, // padding left & right
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderRadius: 'sm',
          boxShadow: 'md',
        }}
      >
        <div>
          <Typography level="h2" component="h1">
            Clipboard manager
          </Typography>
          <NewNote />
          <Note title={"titre"} date={"23 juillet 2024"} text={"Test de note...Test de note...Test de note...Test de note...Test de note...Test de note...Test de note...Test de note...\nTest de note...Test de note..."}/>
        </div>

      </Sheet>

    </CssVarsProvider>
  );
}
