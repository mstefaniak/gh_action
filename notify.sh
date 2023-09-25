#!/usr/bin/env bash

ENV=$1
IFS=',' read -ra NAMESPACES <<< "$2"

ALLOWED_ENVS=( staging1 staging2 staging3 staging4 staging5 staging6 staging7 staging8 staging9 staging10 staging11 staging12 staging13 qa1 qa2 )
ALLOWED_NAMESPACES=( uk de us )

ERROR_MESSAGES=()

if [[ ! " ${ALLOWED_ENVS[@]} " =~ " ${ENV} " ]]; then
  VALID=false
  ERROR_MESSAGES+=("Not supported environment: '${ENV}', following environments are supported: ${ALLOWED_ENVS[@]}")
fi

for NAMESPACE in "${NAMESPACES[@]}"; do
  if [[ ! " ${ALLOWED_NAMESPACES[@]} " =~ " ${NAMESPACE} " ]]; then
    VALID=false
    ERROR_MESSAGES+=("Not supported namespace(s) '${NAMESPACES}', following namespaces are supported: ${ALLOWED_NAMESPACES[@]}")
  fi
done

if [ "$VALID" = true ]; then
  echo "valid_env=${ENV}" | tee -a $GITHUB_OUTPUT
  echo "valid_namespaces=${NAMESPACES}" | tee -a $GITHUB_OUTPUT
  echo "valid=true" | tee -a $GITHUB_OUTPUT
else
  echo "valid=false" | tee -a $GITHUB_OUTPUT
  echo "error_messages='${ERROR_MESSAGES[@]}'" | tee -a $GITHUB_OUTPUT
fi
