import React from 'react'
import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from '@material-ui/core'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';

import './index.css';

function NestedIfGridV2(props) {


    return (

        <div className='formula-build-form'>

            <div className='row'>
                <div className='custom-row border-bottom'>

                    {/* Row: Show Hide */}
                    <div className='col-block row-show-hide w40'>
                        <KeyboardArrowDownIcon />
                    </div>

                    {/* Param ID */}
                    <div className='col-block'>
                        <FormControl variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">Param ID</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={'000001'}
                                // onChange={handleChange}
                                label="Age"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'000001'}>{'[000001]'}</MenuItem>
                                <MenuItem value={'000002'}>{'[000002]'}</MenuItem>
                                <MenuItem value={'000003'}>{'[000005]'}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Param Description */}
                    <div className='col-block w200'>
                        <TextField
                            required
                            id="outlined-required"
                            label="Param Description"
                            defaultValue="Param Tsting Description 1"
                            variant="outlined"
                            disabled={true}
                        />
                    </div>

                    {/* Module Description */}
                    <div className='col-block w200'>
                        <TextField
                            required
                            id="outlined-required"
                            label="Module Description"
                            defaultValue=""
                            variant="outlined"
                        />
                    </div>

                    {/* UOM */}
                    <div className='col-block'>
                        <FormControl variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">UOM</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={'EA'}
                                // onChange={handleChange}
                                label="UOM"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'EA'}>{'EA'}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Operation */}
                    <div className='col-block'>
                        <FormControl variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">Operation</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={'TYPE 1'}
                                // onChange={handleChange}
                                label="Operation"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'+'}>{'+'}</MenuItem>
                                <MenuItem value={'-'}>{'-'}</MenuItem>
                                <MenuItem value={'/'}>{'/'}</MenuItem>
                                <MenuItem value={'*'}>{'*'}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Standard MH/UOM */}
                    <div className='col-block'>
                        <TextField
                            required
                            id="outlined-required"
                            label="Standard MH/UOM"
                            defaultValue="9.25"
                            variant="outlined"
                            type="number"
                        />
                    </div>


                    {/* Formula Preview */}
                    <div className='col-block w60'>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                                    name="checkedI"
                                />
                            }
                            label="IF"
                        />
                    </div>


                    {/* Formula Preview */}
                    <div className='col-block'>
                        <span>{'[000001]*9.25'}</span>
                    </div>

                </div>
            </div>

            <div className='row'>

                {/* First Level Row */}
                <div className='custom-row border-bottom'>

                    {/* Row: Show Hide */}
                    <div className='col-block row-show-hide w40'>
                        <KeyboardArrowDownIcon />
                    </div>

                    {/* Param ID */}
                    <div className='col-block'>
                        <FormControl variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">Param ID</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={'000001'}
                                // onChange={handleChange}
                                label="Age"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'000001'}>{'[000001]'}</MenuItem>
                                <MenuItem value={'000002'}>{'[000002]'}</MenuItem>
                                <MenuItem value={'000003'}>{'[000005]'}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Param Description */}
                    <div className='col-block w200'>
                        <TextField
                            required
                            id="outlined-required"
                            label="Param Description"
                            defaultValue="Param Tsting Description 1"
                            variant="outlined"
                            disabled={true}
                        />
                    </div>

                    {/* Module Description */}
                    <div className='col-block w200'>
                        <TextField
                            required
                            id="outlined-required"
                            label="Module Description"
                            defaultValue=""
                            variant="outlined"
                        />
                    </div>

                    {/* UOM */}
                    <div className='col-block'>
                        <FormControl variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">UOM</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={'EA'}
                                // onChange={handleChange}
                                label="UOM"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'EA'}>{'EA'}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Operation */}
                    <div className='col-block'>
                        <FormControl variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">Operation</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={'TYPE 1'}
                                // onChange={handleChange}
                                label="Operation"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'+'}>{'+'}</MenuItem>
                                <MenuItem value={'-'}>{'-'}</MenuItem>
                                <MenuItem value={'/'}>{'/'}</MenuItem>
                                <MenuItem value={'*'}>{'*'}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Standard MH/UOM */}
                    <div className='col-block'>
                        <TextField
                            required
                            id="outlined-required"
                            label="Standard MH/UOM"
                            defaultValue="9.25"
                            variant="outlined"
                            type="number"
                        />
                    </div>


                    {/* Formula Preview */}
                    <div className='col-block w60'>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                                    name="checkedI"
                                />
                            }
                            label="IF"
                        />
                    </div>


                    {/* ------------------ IF - Condition ------------------------ */}
                    {/* Left Condition */}
                    <div className='col-block'>
                        <FormControl variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">Left Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={'PARAM ID'}
                                // onChange={handleChange}
                                label="Left Type"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'PARAM ID'}>{'PARAM ID'}</MenuItem>
                                <MenuItem value={'NUMBER'}>{'NUMBER'}</MenuItem>
                                <MenuItem value={'TEXT'}>{'TEXT'}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Left Value */}
                    <div className='col-block'>
                        <TextField
                            required
                            id="outlined-required"
                            label="Left Value"
                            defaultValue="9.25"
                            variant="outlined"
                        />
                    </div>

                    {/* Operation */}
                    <div className='col-block'>
                        <FormControl variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">Condition</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={'=='}
                                // onChange={handleChange}
                                label="Condition"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'=='}>{'=='}</MenuItem>
                                <MenuItem value={'>'}>{'>'}</MenuItem>
                                <MenuItem value={'<'}>{'<'}</MenuItem>
                                <MenuItem value={'<>'}>{'<>'}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Right Condition */}
                    <div className='col-block'>
                        <FormControl variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">Right Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={'PARAM ID'}
                                // onChange={handleChange}
                                label="Right Type"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'PARAM ID'}>{'PARAM ID'}</MenuItem>
                                <MenuItem value={'NUMBER'}>{'NUMBER'}</MenuItem>
                                <MenuItem value={'TEXT'}>{'TEXT'}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Right Value */}
                    <div className='col-block'>
                        <TextField
                            required
                            id="outlined-required"
                            label="Right Value"
                            defaultValue="9.25"
                            variant="outlined"
                        />
                    </div>

                    {/* Formula Preview */}
                    <div className='col-block'>
                        <span>{'[000001]*9.25'}</span>
                    </div>

                </div>

                {/* 1.1 custom-child-row */}
                <div className='custom-child-row'>

                    {/* True */}
                    <div className='custom-row border-bottom'>

                        {/* Row: Show Hide */}
                        <div className='col-block row-show-hide w40'>
                            <KeyboardArrowDownIcon />
                        </div>

                        {/* Row: True False Icon */}
                        <div className='col-block col-condition true w40'>
                            <DoneIcon />
                        </div>

                        {/* Param ID */}
                        <div className='col-block'>
                            <FormControl variant="outlined">
                                <InputLabel id="demo-simple-select-outlined-label">Param ID</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={'000001'}
                                    // onChange={handleChange}
                                    label="Age"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={'000001'}>{'[000001]'}</MenuItem>
                                    <MenuItem value={'000002'}>{'[000002]'}</MenuItem>
                                    <MenuItem value={'000003'}>{'[000005]'}</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        {/* Param Description */}
                        <div className='col-block w200'>
                            <TextField
                                required
                                id="outlined-required"
                                label="Param Description"
                                defaultValue="Param Tsting Description 1"
                                variant="outlined"
                                disabled={true}
                            />
                        </div>

                        {/* Module Description */}
                        <div className='col-block w200'>
                            <TextField
                                required
                                id="outlined-required"
                                label="Module Description"
                                defaultValue=""
                                variant="outlined"
                            />
                        </div>

                        {/* UOM */}
                        <div className='col-block'>
                            <FormControl variant="outlined">
                                <InputLabel id="demo-simple-select-outlined-label">UOM</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={'EA'}
                                    // onChange={handleChange}
                                    label="UOM"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={'EA'}>{'EA'}</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        {/* Operation */}
                        <div className='col-block'>
                            <FormControl variant="outlined">
                                <InputLabel id="demo-simple-select-outlined-label">Operation</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={'TYPE 1'}
                                    // onChange={handleChange}
                                    label="Operation"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={'+'}>{'+'}</MenuItem>
                                    <MenuItem value={'-'}>{'-'}</MenuItem>
                                    <MenuItem value={'/'}>{'/'}</MenuItem>
                                    <MenuItem value={'*'}>{'*'}</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        {/* Standard MH/UOM */}
                        <div className='col-block'>
                            <TextField
                                required
                                id="outlined-required"
                                label="Standard MH/UOM"
                                defaultValue="9.25"
                                variant="outlined"
                                type="number"
                            />
                        </div>


                        {/* Formula Preview */}
                        <div className='col-block w60'>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                                        name="checkedI"
                                    />
                                }
                                label="IF"
                            />
                        </div>


                        {/* ------------------ IF - Condition ------------------------ */}
                        {/* Left Condition */}
                        <div className='col-block'>
                            <FormControl variant="outlined">
                                <InputLabel id="demo-simple-select-outlined-label">Left Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={'PARAM ID'}
                                    // onChange={handleChange}
                                    label="Left Type"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={'PARAM ID'}>{'PARAM ID'}</MenuItem>
                                    <MenuItem value={'NUMBER'}>{'NUMBER'}</MenuItem>
                                    <MenuItem value={'TEXT'}>{'TEXT'}</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        {/* Left Value */}
                        <div className='col-block'>
                            <TextField
                                required
                                id="outlined-required"
                                label="Left Value"
                                defaultValue="9.25"
                                variant="outlined"
                            />
                        </div>

                        {/* Operation */}
                        <div className='col-block'>
                            <FormControl variant="outlined">
                                <InputLabel id="demo-simple-select-outlined-label">Condition</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={'=='}
                                    // onChange={handleChange}
                                    label="Condition"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={'=='}>{'=='}</MenuItem>
                                    <MenuItem value={'>'}>{'>'}</MenuItem>
                                    <MenuItem value={'<'}>{'<'}</MenuItem>
                                    <MenuItem value={'<>'}>{'<>'}</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        {/* Right Condition */}
                        <div className='col-block'>
                            <FormControl variant="outlined">
                                <InputLabel id="demo-simple-select-outlined-label">Right Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={'PARAM ID'}
                                    // onChange={handleChange}
                                    label="Right Type"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={'PARAM ID'}>{'PARAM ID'}</MenuItem>
                                    <MenuItem value={'NUMBER'}>{'NUMBER'}</MenuItem>
                                    <MenuItem value={'TEXT'}>{'TEXT'}</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        {/* Right Value */}
                        <div className='col-block'>
                            <TextField
                                required
                                id="outlined-required"
                                label="Right Value"
                                defaultValue="9.25"
                                variant="outlined"
                            />
                        </div>

                        {/* Formula Preview */}
                        <div className='col-block'>
                            <span>{'[000001]*9.25'}</span>
                        </div>

                    </div>

                    {/* 1.1.1 custom-child-row */}
                    <div className='custom-child-row'>

                        {/* True */}
                        <div className='custom-row border-bottom'>

                            {/* Row: Show Hide */}
                            <div className='col-block row-show-hide w40'>
                                <KeyboardArrowDownIcon />
                            </div>

                            {/* Row: True False Icon */}
                            <div className='col-block col-condition true w40'>
                                <DoneIcon />
                            </div>

                            {/* Param ID */}
                            <div className='col-block'>
                                <FormControl variant="outlined">
                                    <InputLabel id="demo-simple-select-outlined-label">Param ID</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={'000001'}
                                        // onChange={handleChange}
                                        label="Age"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={'000001'}>{'[000001]'}</MenuItem>
                                        <MenuItem value={'000002'}>{'[000002]'}</MenuItem>
                                        <MenuItem value={'000003'}>{'[000005]'}</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            {/* Param Description */}
                            <div className='col-block w200'>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Param Description"
                                    defaultValue="Param Tsting Description 1"
                                    variant="outlined"
                                    disabled={true}
                                />
                            </div>

                            {/* Module Description */}
                            <div className='col-block w200'>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Module Description"
                                    defaultValue=""
                                    variant="outlined"
                                />
                            </div>

                            {/* UOM */}
                            <div className='col-block'>
                                <FormControl variant="outlined">
                                    <InputLabel id="demo-simple-select-outlined-label">UOM</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={'EA'}
                                        // onChange={handleChange}
                                        label="UOM"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={'EA'}>{'EA'}</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            {/* Operation */}
                            <div className='col-block'>
                                <FormControl variant="outlined">
                                    <InputLabel id="demo-simple-select-outlined-label">Operation</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={'TYPE 1'}
                                        // onChange={handleChange}
                                        label="Operation"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={'+'}>{'+'}</MenuItem>
                                        <MenuItem value={'-'}>{'-'}</MenuItem>
                                        <MenuItem value={'/'}>{'/'}</MenuItem>
                                        <MenuItem value={'*'}>{'*'}</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            {/* Standard MH/UOM */}
                            <div className='col-block'>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Standard MH/UOM"
                                    defaultValue="9.25"
                                    variant="outlined"
                                    type="number"
                                />
                            </div>


                            {/* Formula Preview */}
                            <div className='col-block w60'>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                                            name="checkedI"
                                        />
                                    }
                                    label="IF"
                                />
                            </div>


                            {/* ------------------ IF - Condition ------------------------ */}
                            {/* Left Condition */}
                            <div className='col-block'>
                                <FormControl variant="outlined">
                                    <InputLabel id="demo-simple-select-outlined-label">Left Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={'PARAM ID'}
                                        // onChange={handleChange}
                                        label="Left Type"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={'PARAM ID'}>{'PARAM ID'}</MenuItem>
                                        <MenuItem value={'NUMBER'}>{'NUMBER'}</MenuItem>
                                        <MenuItem value={'TEXT'}>{'TEXT'}</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            {/* Left Value */}
                            <div className='col-block'>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Left Value"
                                    defaultValue="9.25"
                                    variant="outlined"
                                />
                            </div>

                            {/* Operation */}
                            <div className='col-block'>
                                <FormControl variant="outlined">
                                    <InputLabel id="demo-simple-select-outlined-label">Condition</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={'=='}
                                        // onChange={handleChange}
                                        label="Condition"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={'=='}>{'=='}</MenuItem>
                                        <MenuItem value={'>'}>{'>'}</MenuItem>
                                        <MenuItem value={'<'}>{'<'}</MenuItem>
                                        <MenuItem value={'<>'}>{'<>'}</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            {/* Right Condition */}
                            <div className='col-block'>
                                <FormControl variant="outlined">
                                    <InputLabel id="demo-simple-select-outlined-label">Right Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={'PARAM ID'}
                                        // onChange={handleChange}
                                        label="Right Type"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={'PARAM ID'}>{'PARAM ID'}</MenuItem>
                                        <MenuItem value={'NUMBER'}>{'NUMBER'}</MenuItem>
                                        <MenuItem value={'TEXT'}>{'TEXT'}</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            {/* Right Value */}
                            <div className='col-block'>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Right Value"
                                    defaultValue="9.25"
                                    variant="outlined"
                                />
                            </div>

                            {/* Formula Preview */}
                            <div className='col-block'>
                                <span>{'[000001]*9.25'}</span>
                            </div>

                        </div>

                        {/* False */}
                        <div className='custom-row border-bottom'>

                            {/* Row: Show Hide */}
                            <div className='col-block row-show-hide w40'>
                                <KeyboardArrowDownIcon />
                            </div>

                            {/* Row: True False Icon */}
                            <div className='col-block col-condition false w40'>
                                <ClearIcon />
                            </div>

                            {/* Param ID */}
                            <div className='col-block'>
                                <FormControl variant="outlined">
                                    <InputLabel id="demo-simple-select-outlined-label">Param ID</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={'000001'}
                                        // onChange={handleChange}
                                        label="Age"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={'000001'}>{'[000001]'}</MenuItem>
                                        <MenuItem value={'000002'}>{'[000002]'}</MenuItem>
                                        <MenuItem value={'000003'}>{'[000005]'}</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            {/* Param Description */}
                            <div className='col-block w200'>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Param Description"
                                    defaultValue="Param Tsting Description 1"
                                    variant="outlined"
                                    disabled={true}
                                />
                            </div>

                            {/* Module Description */}
                            <div className='col-block w200'>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Module Description"
                                    defaultValue=""
                                    variant="outlined"
                                />
                            </div>

                            {/* UOM */}
                            <div className='col-block'>
                                <FormControl variant="outlined">
                                    <InputLabel id="demo-simple-select-outlined-label">UOM</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={'EA'}
                                        // onChange={handleChange}
                                        label="UOM"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={'EA'}>{'EA'}</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            {/* Operation */}
                            <div className='col-block'>
                                <FormControl variant="outlined">
                                    <InputLabel id="demo-simple-select-outlined-label">Operation</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={'TYPE 1'}
                                        // onChange={handleChange}
                                        label="Operation"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={'+'}>{'+'}</MenuItem>
                                        <MenuItem value={'-'}>{'-'}</MenuItem>
                                        <MenuItem value={'/'}>{'/'}</MenuItem>
                                        <MenuItem value={'*'}>{'*'}</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            {/* Standard MH/UOM */}
                            <div className='col-block'>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Standard MH/UOM"
                                    defaultValue="9.25"
                                    variant="outlined"
                                    type="number"
                                />
                            </div>


                            {/* Formula Preview */}
                            <div className='col-block w60'>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                                            name="checkedI"
                                        />
                                    }
                                    label="IF"
                                />
                            </div>


                            {/* ------------------ IF - Condition ------------------------ */}
                            {/* Left Condition */}
                            <div className='col-block'>
                                <FormControl variant="outlined">
                                    <InputLabel id="demo-simple-select-outlined-label">Left Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={'PARAM ID'}
                                        // onChange={handleChange}
                                        label="Left Type"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={'PARAM ID'}>{'PARAM ID'}</MenuItem>
                                        <MenuItem value={'NUMBER'}>{'NUMBER'}</MenuItem>
                                        <MenuItem value={'TEXT'}>{'TEXT'}</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            {/* Left Value */}
                            <div className='col-block'>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Left Value"
                                    defaultValue="9.25"
                                    variant="outlined"
                                />
                            </div>

                            {/* Operation */}
                            <div className='col-block'>
                                <FormControl variant="outlined">
                                    <InputLabel id="demo-simple-select-outlined-label">Condition</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={'=='}
                                        // onChange={handleChange}
                                        label="Condition"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={'=='}>{'=='}</MenuItem>
                                        <MenuItem value={'>'}>{'>'}</MenuItem>
                                        <MenuItem value={'<'}>{'<'}</MenuItem>
                                        <MenuItem value={'<>'}>{'<>'}</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            {/* Right Condition */}
                            <div className='col-block'>
                                <FormControl variant="outlined">
                                    <InputLabel id="demo-simple-select-outlined-label">Right Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={'PARAM ID'}
                                        // onChange={handleChange}
                                        label="Right Type"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={'PARAM ID'}>{'PARAM ID'}</MenuItem>
                                        <MenuItem value={'NUMBER'}>{'NUMBER'}</MenuItem>
                                        <MenuItem value={'TEXT'}>{'TEXT'}</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            {/* Right Value */}
                            <div className='col-block'>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Right Value"
                                    defaultValue="9.25"
                                    variant="outlined"
                                />
                            </div>

                            {/* Formula Preview */}
                            <div className='col-block'>
                                <span>{'[000001]*9.25'}</span>
                            </div>

                        </div>
                        {/* 1.1.1 custom-child-row */}
                        <div className='custom-child-row'>

                            {/* True */}
                            <div className='custom-row border-bottom'>

                                {/* Row: Show Hide */}
                                <div className='col-block row-show-hide w40'>
                                    <KeyboardArrowDownIcon />
                                </div>

                                {/* Row: True False Icon */}
                                <div className='col-block col-condition true w40'>
                                    <DoneIcon />
                                </div>

                                {/* Param ID */}
                                <div className='col-block'>
                                    <FormControl variant="outlined">
                                        <InputLabel id="demo-simple-select-outlined-label">Param ID</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={'000001'}
                                            // onChange={handleChange}
                                            label="Age"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={'000001'}>{'[000001]'}</MenuItem>
                                            <MenuItem value={'000002'}>{'[000002]'}</MenuItem>
                                            <MenuItem value={'000003'}>{'[000005]'}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                {/* Param Description */}
                                <div className='col-block w200'>
                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Param Description"
                                        defaultValue="Param Tsting Description 1"
                                        variant="outlined"
                                        disabled={true}
                                    />
                                </div>

                                {/* Module Description */}
                                <div className='col-block w200'>
                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Module Description"
                                        defaultValue=""
                                        variant="outlined"
                                    />
                                </div>

                                {/* UOM */}
                                <div className='col-block'>
                                    <FormControl variant="outlined">
                                        <InputLabel id="demo-simple-select-outlined-label">UOM</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={'EA'}
                                            // onChange={handleChange}
                                            label="UOM"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={'EA'}>{'EA'}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                {/* Operation */}
                                <div className='col-block'>
                                    <FormControl variant="outlined">
                                        <InputLabel id="demo-simple-select-outlined-label">Operation</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={'TYPE 1'}
                                            // onChange={handleChange}
                                            label="Operation"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={'+'}>{'+'}</MenuItem>
                                            <MenuItem value={'-'}>{'-'}</MenuItem>
                                            <MenuItem value={'/'}>{'/'}</MenuItem>
                                            <MenuItem value={'*'}>{'*'}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                {/* Standard MH/UOM */}
                                <div className='col-block'>
                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Standard MH/UOM"
                                        defaultValue="9.25"
                                        variant="outlined"
                                        type="number"
                                    />
                                </div>


                                {/* Formula Preview */}
                                <div className='col-block w60'>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                                checkedIcon={<CheckBoxIcon fontSize="small" />}
                                                name="checkedI"
                                            />
                                        }
                                        label="IF"
                                    />
                                </div>


                                {/* ------------------ IF - Condition ------------------------ */}
                                {/* Left Condition */}
                                <div className='col-block'>
                                    <FormControl variant="outlined">
                                        <InputLabel id="demo-simple-select-outlined-label">Left Type</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={'PARAM ID'}
                                            // onChange={handleChange}
                                            label="Left Type"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={'PARAM ID'}>{'PARAM ID'}</MenuItem>
                                            <MenuItem value={'NUMBER'}>{'NUMBER'}</MenuItem>
                                            <MenuItem value={'TEXT'}>{'TEXT'}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                {/* Left Value */}
                                <div className='col-block'>
                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Left Value"
                                        defaultValue="9.25"
                                        variant="outlined"
                                    />
                                </div>

                                {/* Operation */}
                                <div className='col-block'>
                                    <FormControl variant="outlined">
                                        <InputLabel id="demo-simple-select-outlined-label">Condition</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={'=='}
                                            // onChange={handleChange}
                                            label="Condition"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={'=='}>{'=='}</MenuItem>
                                            <MenuItem value={'>'}>{'>'}</MenuItem>
                                            <MenuItem value={'<'}>{'<'}</MenuItem>
                                            <MenuItem value={'<>'}>{'<>'}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                {/* Right Condition */}
                                <div className='col-block'>
                                    <FormControl variant="outlined">
                                        <InputLabel id="demo-simple-select-outlined-label">Right Type</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={'PARAM ID'}
                                            // onChange={handleChange}
                                            label="Right Type"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={'PARAM ID'}>{'PARAM ID'}</MenuItem>
                                            <MenuItem value={'NUMBER'}>{'NUMBER'}</MenuItem>
                                            <MenuItem value={'TEXT'}>{'TEXT'}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                {/* Right Value */}
                                <div className='col-block'>
                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Right Value"
                                        defaultValue="9.25"
                                        variant="outlined"
                                    />
                                </div>

                                {/* Formula Preview */}
                                <div className='col-block'>
                                    <span>{'[000001]*9.25'}</span>
                                </div>

                            </div>

                            {/* False */}
                            <div className='custom-row border-bottom'>

                                {/* Row: Show Hide */}
                                <div className='col-block row-show-hide w40'>
                                    <KeyboardArrowDownIcon />
                                </div>

                                {/* Row: True False Icon */}
                                <div className='col-block col-condition false w40'>
                                    <ClearIcon />
                                </div>

                                {/* Param ID */}
                                <div className='col-block'>
                                    <FormControl variant="outlined">
                                        <InputLabel id="demo-simple-select-outlined-label">Param ID</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={'000001'}
                                            // onChange={handleChange}
                                            label="Age"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={'000001'}>{'[000001]'}</MenuItem>
                                            <MenuItem value={'000002'}>{'[000002]'}</MenuItem>
                                            <MenuItem value={'000003'}>{'[000005]'}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                {/* Param Description */}
                                <div className='col-block w200'>
                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Param Description"
                                        defaultValue="Param Tsting Description 1"
                                        variant="outlined"
                                        disabled={true}
                                    />
                                </div>

                                {/* Module Description */}
                                <div className='col-block w200'>
                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Module Description"
                                        defaultValue=""
                                        variant="outlined"
                                    />
                                </div>

                                {/* UOM */}
                                <div className='col-block'>
                                    <FormControl variant="outlined">
                                        <InputLabel id="demo-simple-select-outlined-label">UOM</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={'EA'}
                                            // onChange={handleChange}
                                            label="UOM"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={'EA'}>{'EA'}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                {/* Operation */}
                                <div className='col-block'>
                                    <FormControl variant="outlined">
                                        <InputLabel id="demo-simple-select-outlined-label">Operation</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={'TYPE 1'}
                                            // onChange={handleChange}
                                            label="Operation"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={'+'}>{'+'}</MenuItem>
                                            <MenuItem value={'-'}>{'-'}</MenuItem>
                                            <MenuItem value={'/'}>{'/'}</MenuItem>
                                            <MenuItem value={'*'}>{'*'}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                {/* Standard MH/UOM */}
                                <div className='col-block'>
                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Standard MH/UOM"
                                        defaultValue="9.25"
                                        variant="outlined"
                                        type="number"
                                    />
                                </div>


                                {/* Formula Preview */}
                                <div className='col-block w60'>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                                checkedIcon={<CheckBoxIcon fontSize="small" />}
                                                name="checkedI"
                                            />
                                        }
                                        label="IF"
                                    />
                                </div>


                                {/* ------------------ IF - Condition ------------------------ */}
                                {/* Left Condition */}
                                <div className='col-block'>
                                    <FormControl variant="outlined">
                                        <InputLabel id="demo-simple-select-outlined-label">Left Type</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={'PARAM ID'}
                                            // onChange={handleChange}
                                            label="Left Type"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={'PARAM ID'}>{'PARAM ID'}</MenuItem>
                                            <MenuItem value={'NUMBER'}>{'NUMBER'}</MenuItem>
                                            <MenuItem value={'TEXT'}>{'TEXT'}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                {/* Left Value */}
                                <div className='col-block'>
                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Left Value"
                                        defaultValue="9.25"
                                        variant="outlined"
                                    />
                                </div>

                                {/* Operation */}
                                <div className='col-block'>
                                    <FormControl variant="outlined">
                                        <InputLabel id="demo-simple-select-outlined-label">Condition</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={'=='}
                                            // onChange={handleChange}
                                            label="Condition"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={'=='}>{'=='}</MenuItem>
                                            <MenuItem value={'>'}>{'>'}</MenuItem>
                                            <MenuItem value={'<'}>{'<'}</MenuItem>
                                            <MenuItem value={'<>'}>{'<>'}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                {/* Right Condition */}
                                <div className='col-block'>
                                    <FormControl variant="outlined">
                                        <InputLabel id="demo-simple-select-outlined-label">Right Type</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={'PARAM ID'}
                                            // onChange={handleChange}
                                            label="Right Type"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={'PARAM ID'}>{'PARAM ID'}</MenuItem>
                                            <MenuItem value={'NUMBER'}>{'NUMBER'}</MenuItem>
                                            <MenuItem value={'TEXT'}>{'TEXT'}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                {/* Right Value */}
                                <div className='col-block'>
                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Right Value"
                                        defaultValue="9.25"
                                        variant="outlined"
                                    />
                                </div>

                                {/* Formula Preview */}
                                <div className='col-block'>
                                    <span>{'[000001]*9.25'}</span>
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* False */}
                    <div className='custom-row border-bottom'>

                        {/* Row: Show Hide */}
                        <div className='col-block row-show-hide w40'>
                            <KeyboardArrowDownIcon />
                        </div>

                        {/* Row: True False Icon */}
                        <div className='col-block col-condition false w40'>
                            <ClearIcon />
                        </div>

                        {/* Param ID */}
                        <div className='col-block'>
                            <FormControl variant="outlined">
                                <InputLabel id="demo-simple-select-outlined-label">Param ID</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={'000001'}
                                    // onChange={handleChange}
                                    label="Age"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={'000001'}>{'[000001]'}</MenuItem>
                                    <MenuItem value={'000002'}>{'[000002]'}</MenuItem>
                                    <MenuItem value={'000003'}>{'[000005]'}</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        {/* Param Description */}
                        <div className='col-block w200'>
                            <TextField
                                required
                                id="outlined-required"
                                label="Param Description"
                                defaultValue="Param Tsting Description 1"
                                variant="outlined"
                                disabled={true}
                            />
                        </div>

                        {/* Module Description */}
                        <div className='col-block w200'>
                            <TextField
                                required
                                id="outlined-required"
                                label="Module Description"
                                defaultValue=""
                                variant="outlined"
                            />
                        </div>

                        {/* UOM */}
                        <div className='col-block'>
                            <FormControl variant="outlined">
                                <InputLabel id="demo-simple-select-outlined-label">UOM</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={'EA'}
                                    // onChange={handleChange}
                                    label="UOM"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={'EA'}>{'EA'}</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        {/* Operation */}
                        <div className='col-block'>
                            <FormControl variant="outlined">
                                <InputLabel id="demo-simple-select-outlined-label">Operation</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={'TYPE 1'}
                                    // onChange={handleChange}
                                    label="Operation"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={'+'}>{'+'}</MenuItem>
                                    <MenuItem value={'-'}>{'-'}</MenuItem>
                                    <MenuItem value={'/'}>{'/'}</MenuItem>
                                    <MenuItem value={'*'}>{'*'}</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        {/* Standard MH/UOM */}
                        <div className='col-block'>
                            <TextField
                                required
                                id="outlined-required"
                                label="Standard MH/UOM"
                                defaultValue="9.25"
                                variant="outlined"
                                type="number"
                            />
                        </div>


                        {/* Formula Preview */}
                        <div className='col-block w60'>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                                        name="checkedI"
                                    />
                                }
                                label="IF"
                            />
                        </div>


                        {/* ------------------ IF - Condition ------------------------ */}
                        {/* Left Condition */}
                        <div className='col-block'>
                            <FormControl variant="outlined">
                                <InputLabel id="demo-simple-select-outlined-label">Left Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={'PARAM ID'}
                                    // onChange={handleChange}
                                    label="Left Type"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={'PARAM ID'}>{'PARAM ID'}</MenuItem>
                                    <MenuItem value={'NUMBER'}>{'NUMBER'}</MenuItem>
                                    <MenuItem value={'TEXT'}>{'TEXT'}</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        {/* Left Value */}
                        <div className='col-block'>
                            <TextField
                                required
                                id="outlined-required"
                                label="Left Value"
                                defaultValue="9.25"
                                variant="outlined"
                            />
                        </div>

                        {/* Operation */}
                        <div className='col-block'>
                            <FormControl variant="outlined">
                                <InputLabel id="demo-simple-select-outlined-label">Condition</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={'=='}
                                    // onChange={handleChange}
                                    label="Condition"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={'=='}>{'=='}</MenuItem>
                                    <MenuItem value={'>'}>{'>'}</MenuItem>
                                    <MenuItem value={'<'}>{'<'}</MenuItem>
                                    <MenuItem value={'<>'}>{'<>'}</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        {/* Right Condition */}
                        <div className='col-block'>
                            <FormControl variant="outlined">
                                <InputLabel id="demo-simple-select-outlined-label">Right Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={'PARAM ID'}
                                    // onChange={handleChange}
                                    label="Right Type"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={'PARAM ID'}>{'PARAM ID'}</MenuItem>
                                    <MenuItem value={'NUMBER'}>{'NUMBER'}</MenuItem>
                                    <MenuItem value={'TEXT'}>{'TEXT'}</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        {/* Right Value */}
                        <div className='col-block'>
                            <TextField
                                required
                                id="outlined-required"
                                label="Right Value"
                                defaultValue="9.25"
                                variant="outlined"
                            />
                        </div>

                        {/* Formula Preview */}
                        <div className='col-block'>
                            <span>{'[000001]*9.25'}</span>
                        </div>

                    </div>

                </div>

            </div>

            <div className='row'>
                <div className='custom-row border-bottom'>

                    {/* Row: Show Hide */}
                    <div className='col-block row-show-hide w40'>
                        <KeyboardArrowDownIcon />
                    </div>

                    {/* Param ID */}
                    <div className='col-block'>
                        <FormControl variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">Param ID</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={'000001'}
                                // onChange={handleChange}
                                label="Age"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'000001'}>{'[000001]'}</MenuItem>
                                <MenuItem value={'000002'}>{'[000002]'}</MenuItem>
                                <MenuItem value={'000003'}>{'[000005]'}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Param Description */}
                    <div className='col-block w200'>
                        <TextField
                            required
                            id="outlined-required"
                            label="Param Description"
                            defaultValue="Param Tsting Description 1"
                            variant="outlined"
                            disabled={true}
                        />
                    </div>

                    {/* Module Description */}
                    <div className='col-block w200'>
                        <TextField
                            required
                            id="outlined-required"
                            label="Module Description"
                            defaultValue=""
                            variant="outlined"
                        />
                    </div>

                    {/* UOM */}
                    <div className='col-block'>
                        <FormControl variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">UOM</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={'EA'}
                                // onChange={handleChange}
                                label="UOM"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'EA'}>{'EA'}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Operation */}
                    <div className='col-block'>
                        <FormControl variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">Operation</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={'TYPE 1'}
                                // onChange={handleChange}
                                label="Operation"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'+'}>{'+'}</MenuItem>
                                <MenuItem value={'-'}>{'-'}</MenuItem>
                                <MenuItem value={'/'}>{'/'}</MenuItem>
                                <MenuItem value={'*'}>{'*'}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Standard MH/UOM */}
                    <div className='col-block'>
                        <TextField
                            required
                            id="outlined-required"
                            label="Standard MH/UOM"
                            defaultValue="9.25"
                            variant="outlined"
                            type="number"
                        />
                    </div>


                    {/* Formula Preview */}
                    <div className='col-block w60'>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                                    name="checkedI"
                                />
                            }
                            label="IF"
                        />
                    </div>


                    {/* ------------------ IF - Condition ------------------------ */}
                    {/* Left Condition */}
                    <div className='col-block'>
                        <FormControl variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">Left Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={'PARAM ID'}
                                // onChange={handleChange}
                                label="Left Type"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'PARAM ID'}>{'PARAM ID'}</MenuItem>
                                <MenuItem value={'NUMBER'}>{'NUMBER'}</MenuItem>
                                <MenuItem value={'TEXT'}>{'TEXT'}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Left Value */}
                    <div className='col-block'>
                        <TextField
                            required
                            id="outlined-required"
                            label="Left Value"
                            defaultValue="9.25"
                            variant="outlined"
                        />
                    </div>

                    {/* Operation */}
                    <div className='col-block'>
                        <FormControl variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">Condition</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={'=='}
                                // onChange={handleChange}
                                label="Condition"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'=='}>{'=='}</MenuItem>
                                <MenuItem value={'>'}>{'>'}</MenuItem>
                                <MenuItem value={'<'}>{'<'}</MenuItem>
                                <MenuItem value={'<>'}>{'<>'}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Right Condition */}
                    <div className='col-block'>
                        <FormControl variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">Right Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={'PARAM ID'}
                                // onChange={handleChange}
                                label="Right Type"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'PARAM ID'}>{'PARAM ID'}</MenuItem>
                                <MenuItem value={'NUMBER'}>{'NUMBER'}</MenuItem>
                                <MenuItem value={'TEXT'}>{'TEXT'}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Right Value */}
                    <div className='col-block'>
                        <TextField
                            required
                            id="outlined-required"
                            label="Right Value"
                            defaultValue="9.25"
                            variant="outlined"
                        />
                    </div>

                    {/* Formula Preview */}
                    <div className='col-block'>
                        <span>{'[000001]*9.25'}</span>
                    </div>

                </div>
            </div>

            <div className='row'>
                <div className='custom-row border-bottom'>

                    {/* Row: Show Hide */}
                    <div className='col-block row-show-hide w40'>
                        <KeyboardArrowDownIcon />
                    </div>

                    {/* Param ID */}
                    <div className='col-block'>
                        <FormControl variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">Param ID</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={'000001'}
                                // onChange={handleChange}
                                label="Age"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'000001'}>{'[000001]'}</MenuItem>
                                <MenuItem value={'000002'}>{'[000002]'}</MenuItem>
                                <MenuItem value={'000003'}>{'[000005]'}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Param Description */}
                    <div className='col-block w200'>
                        <TextField
                            required
                            id="outlined-required"
                            label="Param Description"
                            defaultValue="Param Tsting Description 1"
                            variant="outlined"
                            disabled={true}
                        />
                    </div>

                    {/* Module Description */}
                    <div className='col-block w200'>
                        <TextField
                            required
                            id="outlined-required"
                            label="Module Description"
                            defaultValue=""
                            variant="outlined"
                        />
                    </div>

                    {/* UOM */}
                    <div className='col-block'>
                        <FormControl variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">UOM</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={'EA'}
                                // onChange={handleChange}
                                label="UOM"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'EA'}>{'EA'}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Operation */}
                    <div className='col-block'>
                        <FormControl variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">Operation</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={'TYPE 1'}
                                // onChange={handleChange}
                                label="Operation"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'+'}>{'+'}</MenuItem>
                                <MenuItem value={'-'}>{'-'}</MenuItem>
                                <MenuItem value={'/'}>{'/'}</MenuItem>
                                <MenuItem value={'*'}>{'*'}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Standard MH/UOM */}
                    <div className='col-block'>
                        <TextField
                            required
                            id="outlined-required"
                            label="Standard MH/UOM"
                            defaultValue="9.25"
                            variant="outlined"
                            type="number"
                        />
                    </div>


                    {/* Formula Preview */}
                    <div className='col-block w60'>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                                    name="checkedI"
                                />
                            }
                            label="IF"
                        />
                    </div>


                    {/* ------------------ IF - Condition ------------------------ */}
                    {/* Left Condition */}
                    <div className='col-block'>
                        <FormControl variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">Left Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={'PARAM ID'}
                                // onChange={handleChange}
                                label="Left Type"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'PARAM ID'}>{'PARAM ID'}</MenuItem>
                                <MenuItem value={'NUMBER'}>{'NUMBER'}</MenuItem>
                                <MenuItem value={'TEXT'}>{'TEXT'}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Left Value */}
                    <div className='col-block'>
                        <TextField
                            required
                            id="outlined-required"
                            label="Left Value"
                            defaultValue="9.25"
                            variant="outlined"
                        />
                    </div>

                    {/* Operation */}
                    <div className='col-block'>
                        <FormControl variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">Condition</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={'=='}
                                // onChange={handleChange}
                                label="Condition"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'=='}>{'=='}</MenuItem>
                                <MenuItem value={'>'}>{'>'}</MenuItem>
                                <MenuItem value={'<'}>{'<'}</MenuItem>
                                <MenuItem value={'<>'}>{'<>'}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Right Condition */}
                    <div className='col-block'>
                        <FormControl variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">Right Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={'PARAM ID'}
                                // onChange={handleChange}
                                label="Right Type"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'PARAM ID'}>{'PARAM ID'}</MenuItem>
                                <MenuItem value={'NUMBER'}>{'NUMBER'}</MenuItem>
                                <MenuItem value={'TEXT'}>{'TEXT'}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Right Value */}
                    <div className='col-block'>
                        <TextField
                            required
                            id="outlined-required"
                            label="Right Value"
                            defaultValue="9.25"
                            variant="outlined"
                        />
                    </div>

                    {/* Formula Preview */}
                    <div className='col-block'>
                        <span>{'[000001]*9.25'}</span>
                    </div>

                </div>
            </div>

            <div className='row'>
                <div className='custom-row border-bottom'>

                    {/* Row: Show Hide */}
                    <div className='col-block row-show-hide w40'>
                        <KeyboardArrowDownIcon />
                    </div>

                    {/* Param ID */}
                    <div className='col-block'>
                        <FormControl variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">Param ID</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={'000001'}
                                // onChange={handleChange}
                                label="Age"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'000001'}>{'[000001]'}</MenuItem>
                                <MenuItem value={'000002'}>{'[000002]'}</MenuItem>
                                <MenuItem value={'000003'}>{'[000005]'}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Param Description */}
                    <div className='col-block w200'>
                        <TextField
                            required
                            id="outlined-required"
                            label="Param Description"
                            defaultValue="Param Tsting Description 1"
                            variant="outlined"
                            disabled={true}
                        />
                    </div>

                    {/* Module Description */}
                    <div className='col-block w200'>
                        <TextField
                            required
                            id="outlined-required"
                            label="Module Description"
                            defaultValue=""
                            variant="outlined"
                        />
                    </div>

                    {/* UOM */}
                    <div className='col-block'>
                        <FormControl variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">UOM</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={'EA'}
                                // onChange={handleChange}
                                label="UOM"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'EA'}>{'EA'}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Operation */}
                    <div className='col-block'>
                        <FormControl variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">Operation</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={'TYPE 1'}
                                // onChange={handleChange}
                                label="Operation"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'+'}>{'+'}</MenuItem>
                                <MenuItem value={'-'}>{'-'}</MenuItem>
                                <MenuItem value={'/'}>{'/'}</MenuItem>
                                <MenuItem value={'*'}>{'*'}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Standard MH/UOM */}
                    <div className='col-block'>
                        <TextField
                            required
                            id="outlined-required"
                            label="Standard MH/UOM"
                            defaultValue="9.25"
                            variant="outlined"
                            type="number"
                        />
                    </div>


                    {/* Formula Preview */}
                    <div className='col-block w60'>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                                    name="checkedI"
                                />
                            }
                            label="IF"
                        />
                    </div>


                    {/* Formula Preview */}
                    <div className='col-block'>
                        <span>{'[000001]*9.25'}</span>
                    </div>

                </div>
            </div>

        </div >
    )
}

export default NestedIfGridV2
