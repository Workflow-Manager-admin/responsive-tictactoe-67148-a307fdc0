#!/bin/bash
cd /home/kavia/workspace/code-generation/responsive-tictactoe-67148-a307fdc0/tic_tac_toe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

