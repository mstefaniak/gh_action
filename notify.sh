#!/usr/bin/env bash

PLENTIFIC_ENV=$1
IFS=',' read -ra NAMESPACES <<< "$2"

ALLOWED_ENVS=( staging1 staging2 staging3 staging4 staging5 staging6 staging7 staging8 staging9 staging10 staging11 staging12 staging13 qa1 qa2 )
ALLOWED_NAMESPACES=( uk de us )

valid=true

if [[ ! " ${ALLOWED_ENVS[@]} " =~ " ${PLENTIFIC_ENV} " ]]; then
  valid=false
fi

for NAMESPACE in "${NAMESPACES[@]}"; do
  if [[ ! " ${ALLOWED_NAMESPACES[@]} " =~ " ${NAMESPACE} " ]]; then
    valid=false
  fi
done

if [ "$valid" = true ]; then
  echo "PLENTIFIC_ENV=${PLENTIFIC_ENV}" | tee -a $GITHUB_ENV
  echo "PLENTIFIC_NAMESPACES=${2}" | tee -a $GITHUB_ENV
  echo "valid=true" | tee -a $GITHUB_OUTPUT
else
  echo "valid=false" | tee -a $GITHUB_OUTPUT
  exit 1
fi
